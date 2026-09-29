-- Existing double deductions: a DTR Undertime/Half Day debit AND a pass slip debit on the same day
-- for the same employee. Run in the employee_monitoring schema.
-- Replace `hrms.` with your HRMS schema name (the value of HRMS_DB_NAME).
-- Review the result first; the DELETE at the bottom is commented out on purpose.

SELECT ps.employee_id_fk employeeId,
       hrms.get_employee_fullname(ps.employee_id_fk) employeeName,
       DATE_FORMAT(ps.date_of_application,'%Y-%m-%d') dtrDate,
       ps.nature_of_business passSlipType,
       ps.time_out passSlipOut, ps.time_in passSlipIn, dtr.time_out dtrTimeOut,
       lps.debit_value passSlipDebit,
       ldtr.dtr_deduction_type dtrDeductionType, ldtr.debit_value dtrDebit,
       ldtr.leave_card_ledger_id dtrDebitId
  FROM pass_slip ps
 INNER JOIN leave_card_ledger_debit lps ON lps.pass_slip_id_fk = ps.pass_slip_id
 INNER JOIN daily_time_record dtr
         ON dtr.company_id_fk = hrms.get_company_id_by_employee_id(ps.employee_id_fk)
        AND DATE_FORMAT(dtr.dtr_date,'%Y-%m-%d') = DATE_FORMAT(ps.date_of_application,'%Y-%m-%d')
 INNER JOIN leave_card_ledger_debit ldtr ON ldtr.daily_time_record_id_fk = dtr.daily_time_record_id
 WHERE ldtr.dtr_deduction_type IN ('Undertime','Half Day')
   AND (ps.nature_of_business IN ('Undertime','Half Day')
        OR (ps.nature_of_business IN ('Personal Business','Wellness Pass')
            AND (ps.time_in IS NULL OR ps.time_in >= (SELECT s.time_out FROM schedule s WHERE s.schedule_id = dtr.schedule_id_fk))))
 ORDER BY dtrDate DESC;

-- After review, remove the duplicate DTR-side debits (the pass slip debit is kept):
-- DELETE FROM leave_card_ledger_debit WHERE leave_card_ledger_id IN ( <dtrDebitId list from above> );
