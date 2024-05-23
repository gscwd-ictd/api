export type BaseOrg = {
  id: string;
  name: string;
  code: string;
  orgType: string;
};

export type OrgEntity = Pick<BaseOrg, 'id' | 'name'>;

export type Office = Omit<BaseOrg, 'orgType'> & {
  departments: Department[];
};

export type Department = Omit<BaseOrg, 'orgType'> & {
  divisions: Omit<BaseOrg, 'orgType'>[];
};

export type OrganizationalStructure = Office[];

export type Organization = {
  offices: OrgEntity[];
  departments: OrgEntity[];
  divisions: OrgEntity[];
};

export type EmployeeDetails = {
  id: string;
  name: string;
  userId: string;
  employeeFullName: string;
  companyId: string;
  positionId: string;
  positionTitle: string;
  assignment: { id: string; name: string; positionId: string; positionTitle: string };
  photoUrl: string;
  signatureUrl?: string;
  userRole: string;
};
