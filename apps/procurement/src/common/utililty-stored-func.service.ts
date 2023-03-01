import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { CODE_GEN, CREATE_PR_CODE_SEQ, GENERATE_PR_CODE, GET_MONTH, GET_VAL, NEXT_VAL, PR_CODE_INIT_DATA, RESET_VAL } from '../constants';

@Injectable()
export class UtilityDbStoredFunctions implements OnModuleInit {
  constructor(private readonly datasource: DataSource) {}

  async onModuleInit() {
    await this.datasource.manager.transaction(
      async (manager) =>
        await Promise.all([
          // initialize the util_pr_code_table
          await this.createPrCodeUtilityTable(manager),

          // insert default data in util_pr_code_table
          await this.insertPrCodeUtilityTableDefaultData(manager),

          // initialize pr_code() function
          await this.createPrCodeGeneratorFunction(manager),

          // initialize code_gen() function
          await this.createCodeGenFunction(manager),

          // initialize get_month() function
          await this.createGetMonthFunction(manager),

          // initialize dev_pr_get_val() function
          await this.createGetValFunction(manager),

          // initialize dev_pr_next_val() function
          await this.createNextValFunction(manager),

          // initialize dev_pr_reset_val() function
          await this.createResetValFunction(manager),
        ])
    );
  }

  /**
   * This function creates `util_pr_code_seq` table in the database, that will serve as
   * a lookup table for when `curr_val` increments or resets back to
   * `1` and synchronize `curr_year` due to a change in current actual year.
   *
   * This table will hold two columns:
   * - `curr_year` - The most recently recorded year of the most recent purchase request.
   * - `curr_val` - The most recently recorded value in sequence of the most recent purchase request.
   *
   * Note: This table doesn't have a `PRIMARY KEY` to avoid creating an `INDEX`.
   * This is so that you can get hot updates (for better performance, since this table will get updated often),
   * and so that the table does not get bloated.
   *
   * To learn more about `postgresql` hot updates, please visit:
   * https://www.cybertec-postgresql.com/en/hot-updates-in-postgresql-for-better-performance/
   */
  private async createPrCodeUtilityTable(manager: EntityManager) {
    await manager.query(CREATE_PR_CODE_SEQ);
  }

  /**
   * Once `util_pr_code_seq` table is created, this function will insert its default data.
   *
   * - `curr_year` default value is the current actual year that this function is initialized.
   * - `curr_val` default value is `0`
   */
  private async insertPrCodeUtilityTableDefaultData(manager: EntityManager) {
    await manager.query(PR_CODE_INIT_DATA);
  }

  /**
   * `gen_pr_code()`
   *
   * Generates a `pr_code`. It automatically handles whether `curr_val` should increment or reset, depending if
   * the most recently recorded year in sequence is equal to the actual year. This should also
   * automatically synchronize `curr_year` to the actual current year.
   *
   */
  private async createPrCodeGeneratorFunction(manager: EntityManager) {
    await manager.query(GENERATE_PR_CODE);
  }

  /**
   *
   * `code_gen(prefix, curr_month, curr_year, curr_seq)`
   *
   * Generates a code with a specified format.
   * - `prefix` - a character string by which this code is identified by.
   * - `curr_month` - a 3-character string of the current actual month.
   * - `curr_year` - the current actual year.
   * - `curr_seq` - the current sequence of this code.
   *
   * @example
   * `PR-JAN-2023-1`
   */
  private async createCodeGenFunction(manager: EntityManager) {
    await manager.query(CODE_GEN);
  }

  /**
   * `get_month()`
   *
   * Generates a 3-character name of the current actual month.
   *
   * - `JAN` for January
   * - `FEB` for February
   * - `MAR` for March
   * - etc
   */
  private async createGetMonthFunction(manager: EntityManager) {
    await manager.query(GET_MONTH);
  }

  /**
   * `dev_pr_get_val()`
   *
   * Retrieves the most recent data in `util_pr_code_seq` table.
   */
  private async createGetValFunction(manager: EntityManager) {
    await manager.query(GET_VAL);
  }

  /**
   * `dev_pr_next_val()`
   *
   * Increments the `curr_val` in `util_pr_code_seq` table.
   *
   * Note that this is only used for development. Please don't manually call this function
   * as it may cause incosistency in data.
   */
  private async createNextValFunction(manager: EntityManager) {
    await manager.query(NEXT_VAL);
  }

  /**
   * `dev_pr_reset_val()`
   *
   * Resets `curr_val` to `1`, and synchronizes `curr_year` to the actual current year.
   *
   * Note that this is only used for development. Please don't manually call this function
   * as it may cause incosistency in data.
   */
  private async createResetValFunction(manager: EntityManager) {
    await manager.query(RESET_VAL);
  }
}
