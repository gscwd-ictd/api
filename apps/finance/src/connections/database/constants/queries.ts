// const regex to convert string to snake case = `'([A-Z])','_\1', 'g'))); $$;'`;

export const init = {
  create_budget: `
    
  CREATE OR REPLACE FUNCTION create_budget(budget_type UUID, general_ledger_account UUID)

  RETURNS TABLE(
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    deleted_at TIMESTAMP WITHOUT TIME ZONE,
    budget_id UUID,
    status budget_details_status_enum,
    budget_type_id_fk UUID,
    general_ledger_account_id_fk UUID
  )
  LANGUAGE plpgsql
  AS
  $$

    DECLARE bd_id UUID;

    BEGIN

      INSERT INTO budget_details(
        budget_type_id_fk, 
        general_ledger_account_id_fk) 
      VALUES(
        budget_type, 
        general_ledger_account) 
      RETURNING budget_details_id INTO bd_id;
      
      RETURN QUERY 
        SELECT 
          bd.created_at, 
          bd.updated_at, 
          bd.deleted_at, 
          bd.budget_details_id, 
          bd.status, 
          bd.budget_type_id_fk, 
          bd.general_ledger_account_id_fk
        FROM budget_details as bd WHERE budget_details_id = bd_id;

     END;
  
  $$;`,
  /**
   *  Make this object immutable
   */
} as const;
