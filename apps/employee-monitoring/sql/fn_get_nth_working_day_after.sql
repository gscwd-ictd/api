-- Returns the date that is exactly `numOfWorkingDays` working days after `currDate`
-- (weekends and dates in `holidays` are skipped). The filing date itself is not counted.
--   Mon + 3 -> Thu, Wed + 3 -> Mon, Fri + 3 -> Wed, Sat + 3 -> Wed
-- Replaces get_date_after_num_of_working_days for pass slips; that function adds N+1
-- calendar days and only skips a weekend/holiday on the final date.
-- Run in: employee_monitoring (production) or `employee-monitoring` (development)

DROP FUNCTION IF EXISTS `get_nth_working_day_after`;
DELIMITER $$
CREATE FUNCTION `get_nth_working_day_after`(currDate DATE, numOfWorkingDays INT) RETURNS date
    READS SQL DATA
BEGIN
    DECLARE d DATE DEFAULT currDate;
    DECLARE counted INT DEFAULT 0;
    DECLARE isHoliday INT DEFAULT 0;
    WHILE counted < numOfWorkingDays DO
        SET d = DATE_ADD(d, INTERVAL 1 DAY);
        SET isHoliday = (SELECT COUNT(*) FROM holidays WHERE holiday_date = d);
        IF DAYOFWEEK(d) NOT IN (1, 7) AND isHoliday = 0 THEN
            SET counted = counted + 1;
        END IF;
    END WHILE;
    RETURN d;
END$$
DELIMITER ;
