export type EmployeeFormValues = {
  firstName: string;
  lastName: string;
  employeeId: string;
  email: string;
  phone: string;
  department: string;
  jobTitle: string;
  address: string;
};

export type Employee =
  EmployeeFormValues & {
    id: string;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
  };