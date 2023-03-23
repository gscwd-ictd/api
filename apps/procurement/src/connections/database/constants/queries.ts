// const regex to convert string to snake case = `'([A-Z])','_\1', 'g'))); $$;'`;

export const init = {
  code_generator: `CREATE OR REPLACE FUNCTION code_generator(prefix VARCHAR, curr_month VARCHAR, curr_year INTEGER, curr_seq BIGINT) RETURNS VARCHAR LANGUAGE sql AS $$ SELECT CONCAT(prefix, '-', curr_month, '-', curr_year, '-', curr_seq); $$;`,

  get_month: `CREATE OR REPLACE FUNCTION get_month() RETURNS VARCHAR LANGUAGE plpgsql AS $$ DECLARE month_now DOUBLE PRECISION; DECLARE month_name VARCHAR; BEGIN month_now = date_part('month', CURRENT_DATE); IF month_now = 1 THEN month_name = 'JAN'; ELSIF month_now = 2 THEN month_name = 'FEB'; ELSIF month_now = 3 THEN month_name = 'MAR'; ELSIF month_now = 4 THEN month_name = 'APR'; ELSIF month_now = 5 THEN month_name = 'MAY'; ELSIF month_now = 6 THEN month_name = 'JUN'; ELSIF month_now = 7 THEN month_name = 'JUL'; ELSIF month_now = 8 THEN month_name = 'AUG'; ELSIF month_now = 9 THEN month_name = 'SEP'; ELSIF month_now = 10 THEN month_name = 'OCT'; ELSIF month_now = 11 THEN month_name = 'NOV'; ELSIF month_now = 12 THEN month_name = 'DEC'; ELSE month_name = 'Month is invalid'; END IF; RETURN month_name; END; $$;`,

  jsonb_rename_attribute: `CREATE OR REPLACE FUNCTION jsonb_rename_attribute(obj JSONB, old_key TEXT, new_key TEXT) RETURNS JSONB LANGUAGE SQL IMMUTABLE AS $$ SELECT obj - old_key || jsonb_build_object(new_key, obj->old_key) $$;`,

  jsonb_rename_attribute_in_array: `CREATE OR REPLACE FUNCTION jsonb_rename_attribute_in_array(arr jsonb, old_key text, new_key text) RETURNS JSONB LANGUAGE SQL IMMUTABLE AS $$ SELECT jsonb_agg( CASE WHEN VALUE ? old_key THEN jsonb_rename_attribute(VALUE, old_key, new_key) ELSE VALUE END) FROM jsonb_array_elements(arr); $$;`,

  /**
   * `generate_pr_code()`
   *
   * Creates a stored function that generates a `pr_code`. It will automatically handle whether `curr_val` should increment or reset,
   * depending if the most recently recorded year in sequence is equal to the actual year. This should also
   * automatically synchronize `curr_year` to the actual current year.
   */
  generate_pr_code: `CREATE OR REPLACE FUNCTION generate_pr_code() RETURNS VARCHAR LANGUAGE plpgsql AS $$ DECLARE val_in_seq BIGINT; DECLARE year_in_seq INTEGER; DECLARE year_now INTEGER; DECLARE pr_code VARCHAR; BEGIN year_now = (date_part('year', CURRENT_DATE)); year_in_seq = (SELECT curr_year FROM public.util_pr_code_seq); IF year_now <> year_in_seq THEN UPDATE PUBLIC.util_pr_code_seq SET curr_val = 1, curr_year = year_now; pr_code = (SELECT code_generator('PR', (SELECT get_month()), year_now, 1)); ELSE UPDATE PUBLIC.util_pr_code_seq SET curr_val = curr_val + 1; SELECT curr_val INTO val_in_seq FROM public.util_pr_code_seq; SELECT curr_year INTO year_in_seq FROM public.util_pr_code_seq; pr_code = (SELECT code_generator('PR', (SELECT get_month()), year_now, val_in_seq)); END IF; RETURN pr_code; END; $$;`,

  /**
   * This function creates `util_pr_code_seq` table in the database, that will serve as
   * a lookup table for when `curr_val` increments or resets back to
   * `1` and synchronize `curr_year` due to a change in current actual year.
   *
   * Once `util_pr_code_seq` table is created, this function will insert its default data.
   *
   * This table will hold two columns:
   * - `curr_year` - The most recently recorded year of the most recent purchase request. `DEFAULT` is current actual year.
   * - `curr_val` - The most recently recorded value in sequence of the most recent purchase request. `DEFUALT` is `0`.
   *
   * Note: This table doesn't have a `PRIMARY KEY` to avoid creating an `INDEX`.
   * This is so that you can get hot updates (for better performance, since this table will get updated often),
   * and so that the table does not get bloated.
   *
   * To learn more about `postgresql` hot updates, please visit:
   * https://www.cybertec-postgresql.com/en/hot-updates-in-postgresql-for-better-performance/
   */
  util_pr_code_seq: `DO $$ DECLARE curr_row_count INTEGER; BEGIN CREATE TABLE IF NOT EXISTS PUBLIC.util_pr_code_seq (curr_year INTEGER NOT NULL, curr_val BIGINT NOT NULL); SELECT COUNT(*) INTO curr_row_count FROM util_pr_code_seq; IF curr_row_count = 0 THEN INSERT INTO util_pr_code_seq (curr_year, curr_val) VALUES (date_part('year', CURRENT_DATE), 0); END IF; END; $$;`,

  /**
   * Creates a function that inserts data into `purchase_request_details` and adds `requested_items` along with it.
   * The result of this function is the Purchase Request.
   *
   * This function accepts the following as parameters:
   * - `account` - The account to which this request will be charged.
   * - `project` - The project by which this request is intended for.
   * - `requestor` - The requesting office that made the Purchase Request.
   * - `deliver_to` - The place to which the items will be delivered to.
   * - `purchase_type` - `SVP`, `Direct Purchase`, `Bidding`
   * - `items` - The requested items for this particular Purchase Request.
   */
  create_pr: `CREATE OR REPLACE FUNCTION create_pr(account UUID, project UUID, requestor UUID, request_purpose VARCHAR, deliver_to VARCHAR, purchase_type UUID, items JSONB ) RETURNS TABLE( createdat TIMESTAMP WITHOUT TIME ZONE, updatedat TIMESTAMP WITHOUT TIME ZONE, deletedat TIMESTAMP WITHOUT TIME ZONE, detailsid UUID, prcode VARCHAR, accountid UUID, projectid UUID, requestingoffice UUID, prpurpose TEXT, deliveryplace VARCHAR, purchasetype VARCHAR, prstatus purchase_request_details_status_enum, addeditems BIGINT ) LANGUAGE plpgsql AS $$ DECLARE pr_id UUID; BEGIN INSERT INTO purchase_request_details(code, account_id, project_id, requesting_office, purpose, place_of_delivery, purchase_type_id_fk) VALUES( (SELECT generate_pr_code()), account, project, requestor, request_purpose, deliver_to, purchase_type) RETURNING pr_details_id INTO pr_id; INSERT INTO requested_items(item_id, requested_quantity, remarks, pr_details_id_fk) SELECT item_id, quantity, remarks, pr_id AS pr_details_id_fk FROM jsonb_to_recordset(items) AS pr_items(item_id UUID, quantity INTEGER, remarks VARCHAR, pr_details_id_fk UUID); RETURN QUERY SELECT * FROM ( SELECT purchase_request_details.created_at, purchase_request_details.updated_at, purchase_request_details.deleted_at, purchase_request_details.pr_details_id, purchase_request_details.code, purchase_request_details.account_id, purchase_request_details.project_id, purchase_request_details.requesting_office, purchase_request_details.purpose, purchase_request_details.place_of_delivery, purchase_types.type, purchase_request_details.status FROM purchase_request_details INNER JOIN purchase_types ON purchase_types.purchase_type_id = purchase_request_details.purchase_type_id_fk WHERE pr_details_id = pr_id) AS pr_details, (SELECT COUNT(*) AS added_items FROM requested_items WHERE pr_details_id_fk = pr_id) AS num_of_requested_items; END; $$;`,

  generate_rfq_code: `CREATE OR REPLACE FUNCTION generate_rfq_code() RETURNS VARCHAR LANGUAGE plpgsql AS $$ DECLARE val_in_seq BIGINT; DECLARE year_in_seq INTEGER; DECLARE year_now INTEGER; DECLARE rfq_code VARCHAR; BEGIN year_now = (date_part('year', CURRENT_DATE)); year_in_seq = (SELECT curr_year FROM public.util_rfq_code_seq); IF year_now <> year_in_seq THEN UPDATE PUBLIC.util_rfq_code_seq SET curr_val = 1, curr_year = year_now; rfq_code = (SELECT code_generator('RFQ', (SELECT get_month()), year_now, 1)); ELSE UPDATE PUBLIC.util_rfq_code_seq SET curr_val = curr_val + 1; SELECT curr_val INTO val_in_seq FROM public.util_rfq_code_seq; SELECT curr_year INTO year_in_seq FROM public.util_rfq_code_seq; rfq_code = (SELECT code_generator('RFQ', (SELECT get_month()), year_now, val_in_seq)); END IF; RETURN rfq_code; END; $$;`,

  util_rfq_code_seq: `DO $$ DECLARE curr_row_count INTEGER; BEGIN CREATE TABLE IF NOT EXISTS PUBLIC.util_rfq_code_seq (curr_year INTEGER NOT NULL, curr_val BIGINT NOT NULL); SELECT COUNT(*) INTO curr_row_count FROM util_rfq_code_seq; IF curr_row_count = 0 THEN INSERT INTO util_rfq_code_seq (curr_year, curr_val) VALUES (date_part('year', CURRENT_DATE), 0); END IF; END; $$;`,

  create_rfq: `CREATE OR REPLACE FUNCTION create_rfq(pr_id UUID, items JSONB) RETURNS SETOF PUBLIC.request_for_quotations LANGUAGE plpgsql AS $$ DECLARE rfq_id UUID; DECLARE santized_obj JSONB; DECLARE i JSONB; DECLARE allow_insert BOOLEAN; BEGIN santized_obj = jsonb_rename_attribute_in_array(items, 'itemId', 'item_id'); allow_insert = false; FOR i IN SELECT * FROM jsonb_array_elements(santized_obj) LOOP SELECT rfq_details_id_fk INTO rfq_id FROM requested_items WHERE requested_item_id = (SELECT uuid(i->>'item_id')) AND pr_details_id_fk = pr_id; IF rfq_id IS NULL THEN allow_insert = true; ELSE EXIT; END IF; END LOOP; IF allow_insert = true THEN INSERT INTO request_for_quotations(code, pr_details_id_fk) VALUES((SELECT generate_rfq_code()), pr_id) RETURNING rfq_details_id INTO rfq_id; FOR i IN SELECT * FROM jsonb_array_elements(santized_obj) LOOP UPDATE requested_items SET rfq_details_id_fk = rfq_id WHERE requested_item_id = (SELECT uuid(i->>'item_id')); IF NOT FOUND THEN RAISE EXCEPTION 'Requested item not found, %', i->>'item_id'; EXIT; END IF; END LOOP; ELSE RAISE EXCEPTION 'Operation cannot proceed. Some (or all) of the requested items specified already has rfq'; END IF; RETURN QUERY SELECT * FROM request_for_quotations WHERE rfq_details_id = rfq_id; END; $$;`,
  /**
   *  Make this object immutable
   */
} as const;
