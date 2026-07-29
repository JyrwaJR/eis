export type GPFEmployeeInfo = {
  treasury: string;
  ddo: string;
  dob: string;
  interest_rate: string;
};

export type MonthlyData = {
  Month: string;
  Subscription: string;
  Refund: string;
  Other: string;
  Category: string;
  Total: string;
  Debit: string;
  Type: string;
};

export type Summary = {
  summary: string;
  balanceI: string;
  balanceII: string;
  total: string;
  missingCredits: string;
};

export type GPFStatement = {
  monthly_data: MonthlyData[];
  summary: Summary[];
  emp: GPFEmployeeInfo;
};
