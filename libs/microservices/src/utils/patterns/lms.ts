export enum GetAllManagersPatterns {
  FIND_ALL_MANAGERS = 'get_all_managers',
}

export enum FindEmployeesPatterns {
  GET_EMPLOYEES_BY_NAME_MATCH = 'get_employees_by_name_match',
  GET_EMPLOYEES_BY_ID = 'get_employee_name',
  GET_EMPLOYEES_DETAILS_BY_ID = 'get_lsp_pds_details',
}

export enum EmployeeTagsPatterns {
  ADD_EMPLOYEE_TAGS = 'add_employee_tags',
  GET_TAGS_BY_EMPLOYEE_ID = 'get_tags_by_employee_id',
  GET_EMPLOYEES_BY_TAG_ID = 'get_employee_by_tag_id',
  GET_EMPLOYEES_BY_TAGS_IDS = 'get_employees_by_tag_ids',
  DELETE_EMPLOYEE_TAGS = 'delete_employee_tags',
}

export enum TrainingPatterns {
  //distribution
  FIND_TRAINING_DISTRIBUTION_BY_SUPERVISOR_ID = 'find_training_distribution_by_supervisor_id',
  FIND_TRAINING_RECOMMENDED_EMPLOYEES_BY_DISTRIBUTION_ID = 'find_training_recommended_employees_by_distribution_id',
  FIND_TRAINING_NOMINEES_BY_DISTRIBUTION_ID = 'find_training_nominees_by_distribution_id',
  FIND_ALL_TRAINING_BY_EMPLOYEE_ID = 'find_all_training_by_employee_id',
  ADD_NOMINEES_BY_TRAINING_DISTRIBUTION_ID = 'add_nominees_by_training_distribution_id',
  UPDATE_TRAINING_NOMINEES_STATUS_BY_ID = 'update_training_nominees_status_by_id',
}
