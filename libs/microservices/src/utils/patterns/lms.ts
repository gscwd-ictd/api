export enum GetAllManagersPatterns {
  FIND_ALL_MANAGERS = 'get_all_managers',
}

export enum FindEmployeesPatterns {
  GET_EMPLOYEES_BY_NAME_MATCH = 'get_employees_by_name_match',
  GET_EMPLOYEES_BY_ID = 'get_employee_name',
  GET_EMPLOYEES_DETAILS_BY_ID = 'get_lsp_pds_details',
  GET_ALL_ORGANIZATION = 'get_all_departments_and_ogm',
  GET_EMPLOYEES_BY_ORGANIZATION_ID = 'get_employees_by_org_id',
  GET_ALL_EMPLOYEES_WITH_SUPERVISOR = 'get_all_employees_with_supervisor',
  GET_EMPLOYEE_WITH_SUPERVISOR = 'get_employee_with_supervisor',
}

export enum EmployeeTagsPatterns {
  ADD_EMPLOYEE_TAGS = 'add_employee_tags',
  GET_TAGS_BY_EMPLOYEE_ID = 'get_tags_by_employee_id',
  GET_EMPLOYEES_BY_TAG_ID = 'get_employee_by_tag_id',
  GET_EMPLOYEES_BY_TAGS_IDS = 'get_employees_by_tag_ids',
  DELETE_EMPLOYEE_TAGS = 'delete_employee_tags',
  COUNT_EMPLOYEE_TAGS = 'count_employee_tags',
}

export enum TrainingPatterns {
  /* distribution */
  FIND_TRAINING_DISTRIBUTION_BY_SUPERVISOR_ID = 'find_training_distribution_by_supervisor_id',
  FIND_TRAINING_RECOMMENDED_EMPLOYEES_BY_DISTRIBUTION_ID = 'find_training_recommended_employees_by_distribution_id',
  FIND_TRAINING_NOMINEES_BY_DISTRIBUTION_ID = 'find_training_nominees_by_distribution_id',
  FIND_ALL_TRAINING_BY_EMPLOYEE_ID = 'find_all_training_by_employee_id',
  ADD_NOMINEES_BY_TRAINING_DISTRIBUTION_ID = 'add_nominees_by_training_distribution_id',
  UPDATE_TRAINING_NOMINEES_STATUS_BY_ID = 'update_training_nominees_status_by_id',
  COUNT_PENDING_NOMINATION_BY_SUPERVISOR_ID = 'count_pending_nomination_by_supervisor_id',

  /*  pdc approvals */
  FIND_ALL_PDC_SECRETARIAT_APPROVAL = 'find_all_pdc_secretariat_approval',
  PDC_SECRETARIAT_APPROVAL = 'for_pdc_secretariat_approval',
  PDC_SECRETARIAT_DECLINED = 'for_pdc_secretariat_declined',
  COUNT_PDC_SECRETARIAT_APPROVAL = 'count_pdc_secretariat_approval',
  FIND_ALL_PDC_CHAIRMAN_APPROVAL = 'find_all_pdc_chairman_approval',
  PDC_CHAIRMAN_APPROVAL = 'for_pdc_chairman_approval',
  PDC_CHAIRMAN_DECLINED = 'for_pdc_chairman_declined',
  COUNT_PDC_CHAIRMAN_APPROVAL = 'count_pdc_chairman_approval',
  FIND_ALL_GM_APPROVAL = 'find_all_gm_approval',
  GM_APPROVAL = 'for_gm_approval',
  GM_DECLINED = 'for_gm_declined',
  COUNT_GM_APPROVAL = 'count_gm_approval',
}

export enum HrmsUserPatterns {
  FIND_LND_USERS = 'get_lnd_users',
  FIND_ASSIGNABLE_LND_USERS = 'get_assignable_lnd_users',
  CREATE_LND_USERS = 'add_lnd_user',
  REMOVE_LND_USERS = 'delete_lnd_user_roles',
}
