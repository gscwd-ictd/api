export type OrganizationEntity = {
  id: string;
  name: string;
  code: string;
  orgType: string;
};

export type Office = Omit<OrganizationEntity, 'orgType'> & {
  departments: Department[];
};

export type Department = Omit<OrganizationEntity, 'orgType'> & {
  divisions: Omit<OrganizationEntity, 'orgType'>[];
};

export type OrganizationalStructure = Office[];
