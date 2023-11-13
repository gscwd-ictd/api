export class SubjectMatterExperts {
  subjectMatter: string;
}

export class Affiliations {
  position: string;
  institution: string;
}

export class Awards {
  name: string;
}

export class Certifications {
  name: string;
}

export class Coaching {
  name: string;
}

export class Education {
  degree: string;
  institution: string;
}

export class Projects {
  name: string;
}

export class Trainings {
  name: string;
}

export class IndivididualInternal {
  employeeId: string;
  experience: string;
  introduction: string;
  expertise: Array<SubjectMatterExperts>;
  affiliations: Array<Affiliations>;
  coaching: Array<Coaching>;
  projects: Array<Projects>;
  trainings: Array<Trainings>;
}

export class IndivididualExternal {
  firstName: string;
  middleName: string;
  lastName: string;
  prefixName: string;
  suffixName: string;
  extensionName: string;
  sex: string;
  contactNumber: string;
  email: string;
  postalAddress: string;
  experience: string;
  tin: string;
  introduction: string;
  expertise: Array<SubjectMatterExperts>;
  photoUrl: string;
  affiliations: Array<Affiliations>;
  awards: Array<Awards>;
  certifications: Array<Certifications>;
  coaching: Array<Coaching>;
  education: Array<Education>;
  projects: Array<Projects>;
  trainings: Array<Trainings>;
}

export class OrganizationExternal {
  organizationName: string;
  contactNumber: string;
  email: string;
  postalAddress: string;
  experience: string;
  tin: string;
  introduction: string;
  expertise: Array<SubjectMatterExperts>;
  photoUrl: string;
  affiliations: Array<Affiliations>;
  awards: Array<Awards>;
  certifications: Array<Certifications>;
  coaching: Array<Coaching>;
  trainings: Array<Trainings>;
}

export type EmployeeFullNameRaw = {
  fullName: string;
};

export type PortalEmployeeDetailsRaw = {
  employeeId: string;
  sex: string;
  contactNumber: string;
  email: string;
  postalAddress: string;
  photoUrl: string;
  tin: string;
  fullName: string;
  awards: [name: string];
  certifications: [name: string];
  education: [degree: string, institution: string];
};
