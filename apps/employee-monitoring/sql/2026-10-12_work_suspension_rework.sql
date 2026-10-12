-- Work suspension rework, step 1 (MySQL 8).
-- TypeORM synchronize (database.config.ts) adds these columns automatically; this script is for
-- environments where sync is off, and after sync has run, skip step 1 and run step 2 only.
-- Step 2 is REQUIRED either way: sync gives old rows is_archived = 0.
-- Run per schema: employee_monitoring (prod), `employee-monitoring` (dev).

-- 1. Columns
ALTER TABLE work_suspension
  ADD COLUMN suspension_type ENUM('WHOLE_DAY','TIME_OF_DAY','LEGACY') NOT NULL DEFAULT 'LEGACY' AFTER suspension_date,
  ADD COLUMN suspension_start_time TIME NULL DEFAULT NULL AFTER suspension_type,
  ADD COLUMN is_archived TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN memo_no VARCHAR(100) NULL DEFAULT NULL,
  ADD COLUMN remarks TEXT NULL DEFAULT NULL,
  MODIFY COLUMN suspension_hours DECIMAL(3,2) NULL DEFAULT NULL,
  ADD INDEX work_suspension_date_idx (suspension_date);

-- 2. Archive every existing suspension as LEGACY (no recomputation of past DTR/ledger/OT/ND)
UPDATE work_suspension
SET suspension_type = 'LEGACY', is_archived = 1
WHERE suspension_type = 'LEGACY' OR suspension_hours IS NOT NULL;

-- 3. One active suspension per date is enforced in the service (step 2), not with a generated
--    column + unique index: TypeORM synchronize would drop a column the entity does not declare.

-- Check
SELECT suspension_type, is_archived, COUNT(*) FROM work_suspension GROUP BY 1, 2;
