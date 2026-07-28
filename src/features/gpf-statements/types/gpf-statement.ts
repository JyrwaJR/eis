type EmployeeInfo = {
  treasury: string;
  ddo: string;
  dob: string;
  interest_rate: string;
};

export type GPFStatement = {
  data: string;
  summary: unknown[]; // Replace with a specific type if you know the structure
  emp: EmployeeInfo;
};
