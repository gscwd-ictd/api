-- =====================================================================================
-- sp_generate_leave_ledger_view  (updated 2026-09)
--
-- Changes from the previous version (search for "CHANGED"):
--  1. 'Wellness Pass' pass slip debits are routed to VACATION LEAVE (previously they
--     matched no branch and were silently left out of the ledger).
--  2. Medical Personal Business: SICK LEAVE only when status is
--     'approved with medical certificate'; anything else goes to VACATION LEAVE
--     (previously any unexpected status fell into SL).
--  3. Single-row lookups use SET x = (SELECT ...) instead of SELECT ... INTO.
--     A SELECT ... INTO that finds no row fires the cursor's NOT FOUND handler, which
--     set isDone = TRUE and silently cut the ledger short.
--
-- nature_of_business ENUM gets 'Wellness Pass' automatically (TypeORM synchronize: true).
-- If synchronize is ever turned off, run:
--   ALTER TABLE pass_slip MODIFY nature_of_business
--     ENUM('Personal Business','Half Day','Undertime','Official Business','Wellness Pass') NOT NULL;
-- =====================================================================================

DROP PROCEDURE IF EXISTS `sp_generate_leave_ledger_view`;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_generate_leave_ledger_view`(
	employeeId VARCHAR(36),
    companyId VARCHAR(10),
    ledgerYear INT
)
BEGIN
DECLARE beginningBalanceLimit INT DEFAULT IF(ledgerYear < 2026, 4, 4);
DECLARE isDone BOOLEAN DEFAULT FALSE;
DECLARE _particulars TEXT;
DECLARE _val DECIMAL(6,3) DEFAULT 000.000;
DECLARE _leaveType VARCHAR(255);
DECLARE _leaveName VARCHAR(255);
DECLARE _leaveDates LONGTEXT;
DECLARE _remarks TEXT;
DECLARE _forcedLeaveBalance DECIMAL(6,3) DEFAULT 000.000;
DECLARE _vacationLeaveBalance DECIMAL(10,3) DEFAULT 000.000;
DECLARE _specialLeaveBenefitBalance DECIMAL(6,3) DEFAULT 000.000;
DECLARE _sickLeaveBalance DECIMAL(6,3) DEFAULT 000.000;
DECLARE _specialPrivilegeLeaveBalance DECIMAL(6,3) DEFAULT 000.000;
DECLARE _wellnessLeaveBalance DECIMAL(6,3) DEFAULT 000.000;
DECLARE _period DATE;
DECLARE _actionType VARCHAR(255);
DECLARE _createdAt DATE;
DECLARE _leaveApplicationId VARCHAR(36);
DECLARE _countLedgerView INT DEFAULT 0;
DECLARE _passSlipId VARCHAR(36);
DECLARE _isMedical boolean;
DECLARE _passSlipStatus VARCHAR(60);
DECLARE sickLeaveRemarks TEXT;
DECLARE vacationLeaveRemarks TEXT;

DECLARE ledgerCursor CURSOR FOR

SELECT createdAt, leaveApplicationId,passSlipId,period, particulars, `value`, actionType,leaveType,leaveName, leaveDates,remarks FROM ((SELECT
lcld.created_at createdAt,
la.leave_application_id leaveApplicationId,
lcld.pass_slip_id_fk passSlipId,
DATE_FORMAT(COALESCE(dtr.dtr_date, ps.date_of_application, COALESCE(la.hrmo_approval_date, la.supervisor_approval_date,  la.hrdm_approval_date, lcld.created_at),lcd.created_at),'%Y-%m-%d') period,
CONCAT( 'DEBIT | ',COALESCE(IF(ps.nature_of_business IS NOT NULL, CONCAT(ps.nature_of_business,' - ', DATE_FORMAT(ps.date_of_application,'%Y-%m-%d')), NULL),IF(dtr_date is not null,CONCAT(IF(lcld.dtr_deduction_type IS NOT NULL,lcld.dtr_deduction_type,'Tardiness'),' - ',dtr.dtr_date),null),
IF(lb.leave_name IS NOT NULL,
CONCAT(lb.leave_name)
,null),
IF(ps.nature_of_business IS NOT NULL,CONCAT(ps.nature_of_business,' - ', DATE_FORMAT(ps.date_of_application,'%Y-%m-%d')),null),
if(lcd.remarks IS NULL, CONCAT('Adjustment | ',get_leave_benefit_name(lcd.leave_benefits_id_fk)),CONCAT('Adjustment | ',get_leave_benefit_name(lcd.leave_benefits_id_fk)))
)) particulars,
COALESCE(lcld.debit_value, lcd.debit_value) `value`,
'debit' actionType,
COALESCE(lb.leave_types,lba.leave_types) leaveType,
COALESCE(lb.leave_name,lba.leave_name) leaveName,
get_leave_date_range(la.leave_application_id,FALSE) leaveDates,
COALESCE(IF(lcld.daily_time_record_id_fk IS NOT NULL, IF(lcld.dtr_deduction_type IS NOT NULL,lcld.dtr_deduction_type,'Tardiness'),null),lb.leave_name, ps.nature_of_business,if(lcd.remarks IS NULL,'Deducted credits',lcd.remarks)) remarks
FROM leave_card_ledger_debit lcld
	LEFT JOIN leave_application la ON la.leave_application_id = lcld.leave_application_id_fk
    LEFT JOIN leave_credit_deductions lcd ON lcd.leave_credit_deductions_id = lcld.leave_credit_deductions_id_fk
	LEFT JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk
    LEFT JOIN leave_benefits lba ON lba.leave_benefits_id = lcd.leave_benefits_id_fk
	LEFT JOIN pass_slip ps ON ps.pass_slip_id = lcld.pass_slip_id_fk
	LEFT JOIN daily_time_record dtr ON dtr.daily_time_record_id = lcld.daily_time_record_id_fk
WHERE (la.employee_id_fk = employeeId
OR ps.employee_id_fk =  employeeId   OR lcd.employee_id_fk= employeeId)
OR dtr.company_id_fk = companyId ORDER BY period ASC
)
UNION
( SELECT createdAt,leaveApplicationId,passSlipId,period,particulars,value,actionType,leaveType,leaveName,leaveDates,remarks FROM
 (SELECT createdAt,leaveApplicationId,passSlipId,period,particulars,value,actionType,leaveType,leaveName,leaveDates,remarks FROM
 ((SELECT DISTINCT
 lclc.created_at createdAt,
 null leaveApplicationId,
 null passSlipId,
 DATE_FORMAT(credit_date,'%Y-%m-%d') period,
 CONCAT('CREDIT | ', COALESCE(COALESCE(IF(lce.remarks <> '' AND lce.remarks IS NOT NULL, CONCAT('Adjustment | ',lb.leave_name),null),CONCAT('Adjustment | ',lb.leave_name)), CONCAT('Leave Add Back - ',''))) particulars,
 lce.credit_value `value`,
 'credit' actionType,
 lb.leave_types leaveType,
 lb.leave_name leaveName,
 null leaveDates,
IF(lab.leave_add_back_id IS NOT NULL, lab.reason, COALESCE(IF(lce.remarks <> '' AND lce.remarks IS NOT NULL, lce.remarks,null),'Earned Credits')) remarks
    FROM leave_card_ledger_credit lclc LEFT JOIN leave_credit_earnings lce
    ON lclc.leave_credit_earning_id_fk = lce.leave_credit_earnings_id
    LEFT JOIN leave_benefits lb ON lb.leave_benefits_id = lce.leave_benefits_id_fk
    LEFT JOIN daily_time_record dtr ON dtr.daily_time_record_id = lce.daily_time_record_id_fk
    LEFT JOIN leave_add_back lab ON lab.leave_add_back_id = lclc.leave_add_back_id_fk
WHERE lce.employee_id_fk = employeeId AND year(lclc.created_at) = ledgerYear ORDER BY createdAt ASC LIMIT beginningBalanceLimit, 9999999) UNION (
SELECT DISTINCT
 lclc.created_at createdAt,
 null leaveApplicationId,
 null passSlipId,
 DATE_FORMAT(lab.created_at,'%Y-%m-%d') period,
 CONCAT('CREDIT | ', CONCAT('Leave Add Back - ',lad.leave_date)) particulars,
 lab.credit_value `value`,
 'credit' actionType,
 lb.leave_types leaveType,
 lb.leave_name leaveName,
 null leaveDates,
 IF(lab.leave_add_back_id IS NOT NULL, lab.reason, 'Earned Credits') remarks
    FROM leave_card_ledger_credit lclc
    LEFT JOIN leave_add_back lab ON lab.leave_add_back_id = lclc.leave_add_back_id_fk
    INNER JOIN leave_application_dates lad ON lad.leave_application_date_id = lab.leave_application_dates_id_fk
    INNER JOIN leave_application la ON la.leave_application_id = lad.leave_application_id_fk
    INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk
 WHERE la.employee_id_fk =  employeeId
)
UNION(
SELECT distinct
 lclc.created_at createdAt,
 null leaveApplicationId,
 null passSlipId,
 DATE_FORMAT(credit_date,'%Y-%m-%d') period,
 CONCAT('CREDIT | ',IF(DATE_FORMAT(credit_date,'%Y-%m-%d')<>CONCAT(ledgerYear,'-01-01'), lb.leave_name,'Beginning Balance')) particulars,
 lce.credit_value `value`,
 'credit' actionType,
 IF(lb.leave_types, lb.leave_types, 'special leave benefit') leaveType,
 lb.leave_name leaveName,
null leaveDates,
IF(lab.leave_add_back_id IS NOT NULL, lab.reason, COALESCE(IF(lce.remarks <> '' AND lce.remarks IS NOT NULL, lce.remarks,null),'Earned Credits')) remarks
    FROM leave_card_ledger_credit lclc
    LEFT JOIN leave_credit_earnings lce ON lclc.leave_credit_earning_id_fk = lce.leave_credit_earnings_id
    LEFT JOIN leave_benefits lb ON lb.leave_benefits_id = lce.leave_benefits_id_fk
    LEFT JOIN daily_time_record dtr ON dtr.daily_time_record_id = lce.daily_time_record_id_fk
    LEFT JOIN leave_add_back lab ON lab.leave_add_back_id = lclc.leave_add_back_id_fk
WHERE lce.employee_id_fk = employeeId  AND DATE_FORMAT(credit_date,'%Y-%m-%d') = CONCAT(ledgerYear,'-01-01') ORDER BY createdAt ASC LIMIT beginningBalanceLimit
)) creditsCombined ORDER BY createdAt ASC ) creditsOrdered ORDER BY createdAt ASC
)) ledger WHERE year(period) = ledgerYear ORDER BY period ASC, createdAt ASC,  actionType ASC;

DECLARE CONTINUE HANDLER FOR NOT FOUND SET isDone = true;

DROP TEMPORARY TABLE IF EXISTS leave_ledger_view;

CREATE TEMPORARY TABLE leave_ledger_view(
	ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    leaveApplicationId VARCHAR(36),
    passSlipId VARCHAR(36),
    period DATE,
    particulars TEXT,
    forcedLeave DECIMAL(6,3) DEFAULT 0.000,
    forcedLeaveBalance DECIMAL(6,3),
    vacationLeave DECIMAL(6,3) DEFAULT 0.000,
    vacationLeaveBalance DECIMAL(10,3),
    sickLeave DECIMAL(6,3) DEFAULT 0.000,
    sickLeaveBalance DECIMAL(6,3),
    specialLeaveBenefit DECIMAL(6,3) DEFAULT 0.000,
    specialLeaveBenefitBalance DECIMAL(6,3),
    specialPrivilegeLeave DECIMAL(6,3) DEFAULT 0.000,
    specialPrivilegeLeaveBalance DECIMAL(6,3) DEFAULT 0.000,
    wellnessLeave DECIMAL(6,3),
    wellnessLeaveBalance DECIMAL(6,3) DEFAULT 0.000,
    leaveDates LONGTEXT,
    actionType VARCHAR(6),
	remarks TEXT
);

OPEN ledgerCursor;

read_loop : LOOP

	FETCH ledgerCursor INTO _createdAt,_leaveApplicationId,_passSlipId, _period, _particulars, _val, _actionType, _leaveType, _leaveName, _leaveDates, _remarks;
     IF isDone = true THEN
		LEAVE read_loop;
     END IF;
     IF _actionType = 'debit' THEN
         SET _val = _val * -1;
	 ELSE
		 SET _val = _val * 1;
	 END IF;

    IF _leaveName = 'Forced Leave' THEN
      SELECT IF(SUM(forcedLeave) IS NULL,0,SUM(forcedLeave)) INTO _forcedLeaveBalance FROM leave_ledger_view;

	  SELECT SUM(vacationLeave),SUM(specialLeaveBenefit),SUM(sickLeave),SUM(specialPrivilegeLeave), SUM(wellnessLeave)
      INTO _vacationLeaveBalance,_specialLeaveBenefitBalance,_sickLeaveBalance,_specialPrivilegeLeaveBalance, _wellnessLeaveBalance FROM leave_ledger_view;
		IF _particulars = 'CREDIT | Beginning Balance' THEN
		   SELECT count(*) INTO _countLedgerView FROM leave_ledger_view WHERE particulars = 'CREDIT | Beginning Balance';
		   IF _countLedgerView = 0 THEN
			INSERT INTO leave_ledger_view(leaveApplicationId,period, particulars, forcedLeave, forcedLeaveBalance,specialLeaveBenefitBalance,vacationLeaveBalance,sickLeaveBalance,specialPrivilegeLeaveBalance, wellnessLeaveBalance, leaveDates, actionType,remarks)
			VALUES (_leaveApplicationId, _period, _particulars, _val, _forcedLeaveBalance+_val, _specialLeaveBenefitBalance, _vacationLeaveBalance,_sickLeaveBalance,_specialPrivilegeLeaveBalance,_wellnessLeaveBalance, _leaveDates,_actionType,_remarks);
			ELSE
			   UPDATE leave_ledger_view SET forcedLeaveBalance = _forcedLeaveBalance+_val, forcedLeave = _val WHERE ID = 1 ;
		   END IF;
		   ELSE
             IF  _period >= '2024-05-31'  THEN
			  INSERT INTO leave_ledger_view( leaveApplicationId,period, particulars, forcedLeave, forcedLeaveBalance,specialLeaveBenefitBalance,vacationLeaveBalance,sickLeaveBalance,specialPrivilegeLeaveBalance, wellnessLeaveBalance, leaveDates, actionType,remarks)
			VALUES (_leaveApplicationId,_period, _particulars, _val, _forcedLeaveBalance+_val, _specialLeaveBenefitBalance, _vacationLeaveBalance,_sickLeaveBalance,_specialPrivilegeLeaveBalance,_wellnessLeaveBalance, _leaveDates,_actionType,_remarks);
			END IF;
        END IF;
    END IF;

    IF _remarks = 'Personal Business' THEN
        -- CHANGED (3): scalar subquery, does not fire NOT FOUND
		SET _isMedical = (SELECT is_medical FROM pass_slip WHERE pass_slip_id = _passSlipId LIMIT 1);
        IF _isMedical = true THEN
		      SET _passSlipStatus = (SELECT pass_slip_approval.status FROM pass_slip_approval WHERE pass_slip_id_fk = _passSlipId LIMIT 1);
              -- CHANGED (2): SL only with medical certificate; everything else is VL
			  IF _passSlipStatus = 'approved with medical certificate' THEN
              #SL Deduction
					 SELECT IF(SUM(sickLeave) IS NULL,0,SUM(sickLeave)) INTO _sickLeaveBalance FROM leave_ledger_view;
       SELECT SUM(forcedLeave),SUM(vacationLeave),SUM(specialLeaveBenefit),SUM(specialPrivilegeLeave), SUM(wellnessLeave)
       INTO _forcedLeaveBalance,_vacationLeaveBalance,_specialLeaveBenefitBalance,_specialPrivilegeLeaveBalance, _wellnessLeaveBalance FROM leave_ledger_view;
       INSERT INTO leave_ledger_view(leaveApplicationId,period, particulars,sickLeave, sickLeaveBalance, specialLeaveBenefitBalance,forcedLeaveBalance, vacationLeaveBalance,specialPrivilegeLeaveBalance, wellnessLeaveBalance, leaveDates, actionType,remarks)
				 VALUES( _leaveApplicationId,_period, _particulars, _val, _sickLeaveBalance + _val,_specialLeaveBenefitBalance, _forcedLeaveBalance, _vacationLeaveBalance,_specialPrivilegeLeaveBalance, _wellnessLeaveBalance,_leaveDates,_actionType, CONCAT(_remarks,'(Medical Purpose)'));
              ELSE
              #VL Deduction
					 SELECT IF(SUM(vacationLeave) IS NULL,0, SUM(vacationLeave)) INTO _vacationLeaveBalance FROM leave_ledger_view;
				SELECT SUM(forcedLeave),SUM(specialLeaveBenefit),SUM(sickLeave),SUM(specialPrivilegeLeave), SUM(wellnessLeave)
				INTO _forcedLeaveBalance,_specialLeaveBenefitBalance,_sickLeaveBalance,_specialPrivilegeLeaveBalance, _wellnessLeaveBalance FROM leave_ledger_view;

                INSERT INTO leave_ledger_view(leaveApplicationId,period, particulars, vacationLeave, vacationLeaveBalance,forcedLeaveBalance, specialLeaveBenefitBalance,sickLeaveBalance,specialPrivilegeLeaveBalance, wellnessLeaveBalance, leaveDates, actionType,remarks)
				VALUES(_leaveApplicationId,_period, _particulars, _val, _vacationLeaveBalance+_val, _forcedLeaveBalance, _specialLeaveBenefitBalance,_sickLeaveBalance,_specialPrivilegeLeaveBalance,_wellnessLeaveBalance,_leaveDates,_actionType,_remarks);
              END IF;
			ELSE

                SELECT IF(SUM(vacationLeave) IS NULL,0, SUM(vacationLeave)) INTO _vacationLeaveBalance FROM leave_ledger_view;

				SELECT SUM(forcedLeave),SUM(specialLeaveBenefit),SUM(sickLeave),SUM(specialPrivilegeLeave), SUM(wellnessLeave)
				INTO _forcedLeaveBalance,_specialLeaveBenefitBalance,_sickLeaveBalance,_specialPrivilegeLeaveBalance, _wellnessLeaveBalance FROM leave_ledger_view;

                INSERT INTO leave_ledger_view(leaveApplicationId,period, particulars, vacationLeave, vacationLeaveBalance,forcedLeaveBalance, specialLeaveBenefitBalance,sickLeaveBalance,specialPrivilegeLeaveBalance, wellnessLeaveBalance, leaveDates, actionType,remarks)
				VALUES(_leaveApplicationId, _period, _particulars, _val, _vacationLeaveBalance+_val, _forcedLeaveBalance, _specialLeaveBenefitBalance,_sickLeaveBalance,_specialPrivilegeLeaveBalance,_wellnessLeaveBalance,_leaveDates,_actionType,_remarks);

        END IF;
    END IF;

    -- CHANGED (1): Wellness Pass deducts from Vacation Leave
    IF _leaveName = 'Vacation Leave' OR _remarks = 'Tardiness' OR _remarks = 'Undertime' OR _remarks = 'Half Day' OR _remarks = 'Wellness Pass' THEN

	   SELECT IF(SUM(vacationLeave) IS NULL,0, SUM(vacationLeave)) INTO _vacationLeaveBalance FROM leave_ledger_view;

       SELECT SUM(forcedLeave),SUM(specialLeaveBenefit),SUM(sickLeave),SUM(specialPrivilegeLeave), SUM(wellnessLeave)
       INTO _forcedLeaveBalance, _specialLeaveBenefitBalance, _sickLeaveBalance, _specialPrivilegeLeaveBalance, _wellnessLeaveBalance FROM leave_ledger_view;

       IF _particulars = 'CREDIT | Beginning Balance' THEN
			 SELECT count(*) INTO _countLedgerView FROM leave_ledger_view WHERE particulars = 'CREDIT | Beginning Balance';
		     IF _countLedgerView = 0 THEN
				INSERT INTO leave_ledger_view(leaveApplicationId, period, particulars, vacationLeave, vacationLeaveBalance,forcedLeaveBalance, specialLeaveBenefitBalance,sickLeaveBalance,specialPrivilegeLeaveBalance, wellnessLeaveBalance, leaveDates, actionType,remarks)
				VALUES(_leaveApplicationId,_period, _particulars, _val, _vacationLeaveBalance+_val, _forcedLeaveBalance, _specialLeaveBenefitBalance,_sickLeaveBalance,_specialPrivilegeLeaveBalance, _wellnessLeaveBalance, _leaveDates,_actionType,_remarks);
                ELSE
					UPDATE leave_ledger_view SET vacationLeaveBalance = _vacationLeaveBalance+_val, vacationLeave = _val WHERE ID = 1;
             END IF;
             ELSE
             IF _particulars = 'CREDIT | Adjustment | Vacation Leave' THEN
				INSERT INTO leave_ledger_view(leaveApplicationId,period, particulars, vacationLeave, vacationLeaveBalance,forcedLeaveBalance, specialLeaveBenefitBalance,sickLeaveBalance,specialPrivilegeLeaveBalance,wellnessLeaveBalance, leaveDates, actionType,remarks)
				VALUES(_leaveApplicationId,_createdAt, _particulars, _val, _vacationLeaveBalance+_val, _forcedLeaveBalance, _specialLeaveBenefitBalance,_sickLeaveBalance,_specialPrivilegeLeaveBalance, _wellnessLeaveBalance, _leaveDates,_actionType,_remarks);
			  END IF;
					IF _actionType= 'debit' THEN
                      IF _leaveName = 'Vacation Leave' AND _particulars = 'DEBIT | Vacation Leave' AND _period >= '2024-05-31' THEN
						-- CHANGED (3)
						SET vacationLeaveRemarks = (SELECT CONVERT(COALESCE(in_philippines, abroad), BINARY) FROM leave_application WHERE leave_application_id = _leaveApplicationId LIMIT 1);
						INSERT INTO leave_ledger_view(leaveApplicationId,period, particulars, vacationLeave, vacationLeaveBalance,forcedLeaveBalance, specialLeaveBenefitBalance,sickLeaveBalance,specialPrivilegeLeaveBalance, wellnessLeaveBalance, leaveDates, actionType,remarks)
				VALUES(_leaveApplicationId,_period, _particulars, _val, _vacationLeaveBalance+_val, _forcedLeaveBalance, _specialLeaveBenefitBalance,_sickLeaveBalance,_specialPrivilegeLeaveBalance,_wellnessLeaveBalance,_leaveDates,_actionType, vacationLeaveRemarks);
						ELSE
						IF ( (_remarks <> 'Tardiness' AND _remarks <> 'Undertime' AND _remarks <> 'Half Day') OR _period >= '2024-05-01' ) THEN
						INSERT INTO leave_ledger_view(leaveApplicationId,period, particulars, vacationLeave, vacationLeaveBalance,forcedLeaveBalance, specialLeaveBenefitBalance,sickLeaveBalance,specialPrivilegeLeaveBalance, wellnessLeaveBalance, leaveDates, actionType,remarks)
				VALUES(_leaveApplicationId,_createdAt, _particulars, _val, _vacationLeaveBalance+_val, _forcedLeaveBalance, _specialLeaveBenefitBalance,_sickLeaveBalance,_specialPrivilegeLeaveBalance, _wellnessLeaveBalance, _leaveDates,_actionType,_remarks);
						END IF;
                    END IF;
				  END IF;
                  IF _particulars LIKE '%CREDIT | Leave Add Back%' THEN
                        INSERT INTO leave_ledger_view(leaveApplicationId,period, particulars, vacationLeave, vacationLeaveBalance,forcedLeaveBalance, specialLeaveBenefitBalance,sickLeaveBalance,specialPrivilegeLeaveBalance, wellnessLeaveBalance, leaveDates, actionType,remarks)
				VALUES(_leaveApplicationId,_period, _particulars, _val, _vacationLeaveBalance+_val, _forcedLeaveBalance, _specialLeaveBenefitBalance,_sickLeaveBalance,_specialPrivilegeLeaveBalance, _wellnessLeaveBalance, _leaveDates, _actionType, _remarks);
                        END IF;
       END IF ;

    END IF ;

    IF _leaveType = 'special leave benefit' THEN
		SELECT IF(SUM(specialLeaveBenefit) IS NULL,0,SUM(specialLeaveBenefit)) INTO _specialLeaveBenefitBalance FROM leave_ledger_view;

        SELECT SUM(forcedLeave),SUM(vacationLeave),SUM(sickLeave),SUM(specialPrivilegeLeave), SUM(wellnessLeave)
        INTO _forcedLeaveBalance,_vacationLeaveBalance,_sickLeaveBalance,_specialPrivilegeLeaveBalance,_wellnessLeaveBalance FROM leave_ledger_view;

		  IF _particulars = 'CREDIT | Beginning Balance' THEN
			 SELECT count(*) INTO _countLedgerView FROM leave_ledger_view WHERE particulars = 'CREDIT | Beginning Balance';
		     IF _countLedgerView = 0 THEN
				INSERT INTO leave_ledger_view(leaveApplicationId,period, particulars, specialLeaveBenefit, specialLeaveBenefitBalance,forcedLeaveBalance, vacationLeaveBalance,sickLeaveBalance,specialPrivilegeLeaveBalance, wellnessLeaveBalance, leaveDates, actionType,remarks)
				VALUES( _leaveApplicationId,_period, _particulars, _val, _specialLeaveBenefitBalance + _val, _forcedLeaveBalance, _vacationLeaveBalance, _sickLeaveBalance,_specialPrivilegeLeaveBalance,_wellnessLeaveBalance, _leaveDates,_actionType,_remarks);
				ELSE
					UPDATE leave_ledger_view SET  specialLeaveBenefit = _val, specialLeaveBenefitBalance = _specialLeaveBenefitBalance + _val WHERE ID = 1;
             END IF;
			 ELSE
				INSERT INTO leave_ledger_view(leaveApplicationId,period, particulars, specialLeaveBenefit, specialLeaveBenefitBalance,forcedLeaveBalance, vacationLeaveBalance,sickLeaveBalance,specialPrivilegeLeaveBalance, wellnessLeaveBalance,leaveDates, actionType,remarks)
				VALUES( _leaveApplicationId,_period, _particulars, _val, _specialLeaveBenefitBalance + _val, _forcedLeaveBalance, _vacationLeaveBalance, _sickLeaveBalance,_specialPrivilegeLeaveBalance, _wellnessLeaveBalance,_leaveDates,_actionType,_remarks);
		  END IF;
    END IF;

       IF _leaveName = 'Leave Without Pay' THEN
          #debit to vacation leave
         SELECT IF(SUM(vacationLeave) IS NULL,0, SUM(vacationLeave)) INTO _vacationLeaveBalance FROM leave_ledger_view;

       SELECT SUM(forcedLeave),SUM(specialLeaveBenefit),SUM(sickLeave),SUM(specialPrivilegeLeave), SUM(wellnessLeave)
       INTO _forcedLeaveBalance,_specialLeaveBenefitBalance,_sickLeaveBalance,_specialPrivilegeLeaveBalance,_wellnessLeaveBalance FROM leave_ledger_view;

       INSERT INTO leave_ledger_view(leaveApplicationId,period, particulars, vacationLeave, vacationLeaveBalance,forcedLeaveBalance, specialLeaveBenefitBalance,sickLeaveBalance,specialPrivilegeLeaveBalance, wellnessLeaveBalance, leaveDates, actionType,remarks)
				VALUES(_leaveApplicationId,_period, _particulars, _val, _vacationLeaveBalance+_val, _forcedLeaveBalance, _specialLeaveBenefitBalance,_sickLeaveBalance,_specialPrivilegeLeaveBalance,_wellnessLeaveBalance,_leaveDates,_actionType,_remarks);
    END IF;


    IF _leaveName = 'Sick Leave' THEN

       SELECT IF(SUM(sickLeave) IS NULL,0,SUM(sickLeave)) INTO _sickLeaveBalance FROM leave_ledger_view;
       SELECT SUM(forcedLeave),SUM(vacationLeave),SUM(specialLeaveBenefit),SUM(specialPrivilegeLeave), SUM(wellnessLeave)
       INTO _forcedLeaveBalance,_vacationLeaveBalance,_specialLeaveBenefitBalance,_specialPrivilegeLeaveBalance, _wellnessLeaveBalance FROM leave_ledger_view;
       IF _particulars = 'CREDIT | Beginning Balance' THEN
			 SELECT count(*) INTO _countLedgerView FROM leave_ledger_view WHERE particulars = 'CREDIT | Beginning Balance';
		     IF _countLedgerView = 0 THEN
                 INSERT INTO leave_ledger_view(leaveApplicationId,period, particulars,sickLeave, sickLeaveBalance, specialLeaveBenefitBalance,forcedLeaveBalance, vacationLeaveBalance,specialPrivilegeLeaveBalance,wellnessLeaveBalance, leaveDates, actionType,remarks)
				 VALUES( _leaveApplicationId,_period, _particulars, _val, _sickLeaveBalance + _val,_specialLeaveBenefitBalance, _forcedLeaveBalance, _vacationLeaveBalance,_specialPrivilegeLeaveBalance,_wellnessLeaveBalance,_leaveDates,_actionType,_remarks);
			   ELSE
				 UPDATE leave_ledger_view SET sickLeaveBalance = _sickLeaveBalance + _val, sickLeave = _val WHERE ID = 1;
             END IF;
             ELSE
               IF _actionType= 'debit' AND _particulars = 'DEBIT | Sick Leave' AND _period >= '2024-05-31'  THEN
				 -- CHANGED (3)
				 SET sickLeaveRemarks = (SELECT CONVERT(COALESCE(in_hospital, out_patient), BINARY) FROM leave_application WHERE leave_application_id = _leaveApplicationId LIMIT 1);
				 INSERT INTO leave_ledger_view(leaveApplicationId,period, particulars,sickLeave, sickLeaveBalance, specialLeaveBenefitBalance,forcedLeaveBalance, vacationLeaveBalance,specialPrivilegeLeaveBalance, wellnessLeaveBalance, leaveDates, actionType,remarks)
				 VALUES( _leaveApplicationId,_period, _particulars, _val, _sickLeaveBalance + _val,_specialLeaveBenefitBalance, _forcedLeaveBalance, _vacationLeaveBalance,_specialPrivilegeLeaveBalance,_wellnessLeaveBalance,_leaveDates,_actionType, sickLeaveRemarks);
				 ELSE
                    INSERT INTO leave_ledger_view(leaveApplicationId,period, particulars,sickLeave, sickLeaveBalance, specialLeaveBenefitBalance,forcedLeaveBalance, vacationLeaveBalance,specialPrivilegeLeaveBalance, wellnessLeaveBalance, leaveDates, actionType,remarks)
				 VALUES( _leaveApplicationId,_period, _particulars, _val, _sickLeaveBalance + _val,_specialLeaveBenefitBalance, _forcedLeaveBalance, _vacationLeaveBalance,_specialPrivilegeLeaveBalance,_wellnessLeaveBalance,_leaveDates,_actionType, _remarks);
               END IF;
       END IF;
    END IF;
	#3 DAYS (RECURRING)
    IF _leaveName = 'Special Privilege Leave' THEN
	   SELECT IF(SUM(specialPrivilegeLeave) IS NULL,0,SUM(specialPrivilegeLeave)) INTO _specialPrivilegeLeaveBalance FROM leave_ledger_view;
	   SELECT SUM(forcedLeave),SUM(vacationLeave),SUM(specialLeaveBenefit),SUM(sickLeave), SUM(wellnessLeave)
       INTO _forcedLeaveBalance,_vacationLeaveBalance,_specialLeaveBenefitBalance,_sickLeaveBalance, _wellnessLeaveBalance FROM leave_ledger_view;

       IF _particulars = 'CREDIT | Beginning Balance' THEN
			 SELECT count(*) INTO _countLedgerView FROM leave_ledger_view WHERE particulars = 'CREDIT | Beginning Balance';
		     IF _countLedgerView = 0 THEN
				 INSERT INTO leave_ledger_view(leaveApplicationId,period, particulars, specialPrivilegeLeave, specialPrivilegeLeaveBalance, sickLeaveBalance, specialLeaveBenefitBalance,forcedLeaveBalance, vacationLeaveBalance, wellnessLeaveBalance,leaveDates, actionType,remarks)
				 VALUES( _leaveApplicationId,_period, _particulars, _val, _specialPrivilegeLeaveBalance + _val,_sickLeaveBalance,_specialLeaveBenefitBalance, _forcedLeaveBalance, _vacationLeaveBalance,_wellnessLeaveBalance,_leaveDates,_actionType,_remarks);
				ELSE
					UPDATE leave_ledger_view SET specialPrivilegeLeaveBalance = _specialPrivilegeLeaveBalance + _val, specialPrivilegeLeave = _val WHERE ID = 1;
             END IF;
             ELSE
              IF  _period >= '2024-05-31'  THEN
                INSERT INTO leave_ledger_view(leaveApplicationId,period, particulars, specialPrivilegeLeave, specialPrivilegeLeaveBalance, sickLeaveBalance, specialLeaveBenefitBalance,forcedLeaveBalance, vacationLeaveBalance, wellnessLeaveBalance, leaveDates, actionType,remarks)
				 VALUES( _leaveApplicationId,_period, _particulars, _val, _specialPrivilegeLeaveBalance + _val,_sickLeaveBalance,_specialLeaveBenefitBalance, _forcedLeaveBalance, _vacationLeaveBalance,_wellnessLeaveBalance,_leaveDates,_actionType,_remarks);
			  END IF;
       END IF;
    END IF;

    IF _leaveName = 'Wellness Leave' THEN
	   SELECT IF(SUM(wellnessLeave) IS NULL,0,SUM(wellnessLeave)) INTO _wellnessLeaveBalance FROM leave_ledger_view;
	   SELECT SUM(forcedLeave),SUM(vacationLeave),SUM(specialLeaveBenefit), SUM(sickLeave), SUM(specialPrivilegeLeave)
       INTO _forcedLeaveBalance, _vacationLeaveBalance, _specialLeaveBenefitBalance, _sickLeaveBalance, _specialPrivilegeLeaveBalance FROM leave_ledger_view;

       IF _particulars = 'CREDIT | Beginning Balance' THEN
			 SELECT count(*) INTO _countLedgerView FROM leave_ledger_view WHERE particulars = 'CREDIT | Beginning Balance';
		     IF _countLedgerView = 0 THEN
				 INSERT INTO leave_ledger_view(leaveApplicationId,period, particulars, wellnessLeave, specialPrivilegeLeaveBalance, sickLeaveBalance, specialLeaveBenefitBalance,forcedLeaveBalance, vacationLeaveBalance, wellnessLeaveBalance,leaveDates, actionType,remarks)
				 VALUES( _leaveApplicationId,_period, _particulars, _val, _specialPrivilegeLeaveBalance ,_sickLeaveBalance,_specialLeaveBenefitBalance, _forcedLeaveBalance, _vacationLeaveBalance,_wellnessLeaveBalance + _val,_leaveDates,_actionType,_remarks);
				ELSE
					UPDATE leave_ledger_view SET wellnessLeaveBalance = _wellnessLeaveBalance + _val, wellnessLeave = _val WHERE ID = 1;
             END IF;
             ELSE
              IF  _period >= '2024-05-31' THEN
                INSERT INTO leave_ledger_view(leaveApplicationId,period, particulars, wellnessLeave, specialPrivilegeLeaveBalance, sickLeaveBalance, specialLeaveBenefitBalance,forcedLeaveBalance, vacationLeaveBalance, wellnessLeaveBalance, leaveDates, actionType,remarks)
				 VALUES( _leaveApplicationId,_period, _particulars, _val, _specialPrivilegeLeaveBalance,_sickLeaveBalance,_specialLeaveBenefitBalance, _forcedLeaveBalance, _vacationLeaveBalance,_wellnessLeaveBalance + _val,_leaveDates,_actionType,_remarks);
			  END IF;
       END IF;
    END IF;

END LOOP;
CLOSE ledgerCursor;

SELECT *, IF(wellnessLeave is null, 0.000, wellnessLeave) wellnessLeave FROM leave_ledger_view;

END$$
DELIMITER ;
