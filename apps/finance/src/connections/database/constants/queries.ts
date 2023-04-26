// const regex to convert string to snake case = `'([A-Z])','_\1', 'g'))); $$;'`;

export const init = {
  create_budget: `
  CREATE OR REPLACE FUNCTION create_budget(
    budget_type UUID, 
    general_ledger_account UUID,
    project_name VARCHAR,
    location TEXT, 
    subject VARCHAR,
    work_description TEXT,
    input_quantity INTEGER,
    unit_measurement VARCHAR,
    output_per_day VARCHAR,
    material_cost JSONB,
    labor_cost JSONB,
    equipment_cost JSONB)
  RETURNS UUID
  LANGUAGE plpgsql
  AS
  $$
  DECLARE budget_id UUID;
  DECLARE project_id UUID;
  BEGIN
    INSERT INTO budget_details(
      budget_type_id_fk, 
      general_ledger_account_id_fk) 
    VALUES(
      budget_type, 
      general_ledger_account) 
    RETURNING budget_details_id INTO budget_id;
  
    INSERT INTO project_details(
      budget_details_id_fk,
      project_name,
      location, 
      subject,
      work_description,
      quantity,
      output_per_day)
    VALUES(
      budget_id,
      project_name,
      location, 
      subject,
      work_description,
      input_quantity,
      output_per_day)
    RETURNING project_details_id INTO project_id;
    
    INSERT INTO material_costs(
      project_details_id_fk, 
      specification_id, 
      quantity, 
      unit_cost) 
    SELECT 
      project_id as project_details_id_fk, 
      specification_id, 
      quantity, 
      unit_cost 
    FROM jsonb_to_recordset(material_cost) as m_cost 
      (project_details_id_fk UUID, 
      specification_id UUID, 
      quantity INTEGER, 
      unit_cost NUMERIC);
      
    INSERT INTO labor_costs(
      project_details_id_fk, 
      specification_id,
      number_of_person,
      number_of_days,
      unit_cost) 
    SELECT 
      project_id as project_details_id_fk, 
      specification_id, 
      number_of_person,
      number_of_days,
      unit_cost 
    FROM jsonb_to_recordset(labor_cost) as l_cost 
      (project_details_id_fk UUID, 
      specification_id UUID, 
      number_of_person INTEGER,
      number_of_days INTEGER,
      unit_cost NUMERIC);
      
    INSERT INTO equipment_costs(
      project_details_id_fk, 
      equipment_description,
      number_of_unit,
      number_of_days,
      unit_cost) 
    SELECT 
      project_id as project_details_id_fk, 
      equipment_description, 
      number_of_unit,
      number_of_days,
      unit_cost 
    FROM jsonb_to_recordset(equipment_cost) as e_cost 
      (project_details_id_fk UUID, 
      equipment_description TEXT, 
      number_of_unit INTEGER,
      number_of_days INTEGER,
      unit_cost NUMERIC);
  
    RETURN project_id;
  END;
  $$;`,
  /**
   *  Make this object immutable
   */
} as const;
