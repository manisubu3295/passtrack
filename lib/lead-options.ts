export const employeeCountOptions = ['1–10', '11–50', '51–200', '201–500', '500+'] as const;
export type EmployeeCount = (typeof employeeCountOptions)[number];

export const primaryNeedOptions = [
  'Track pass expiries',
  'Renewal reminders',
  'Centralized employee pass records',
  'Compliance visibility',
] as const;
export type PrimaryNeed = (typeof primaryNeedOptions)[number];
