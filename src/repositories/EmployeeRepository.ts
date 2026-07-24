import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../config/firebase";

import {
  Employee,
  EmployeeFormValues,
} from "../models/Employee";

const employeesCollection =
  collection(db, "employees");

export async function createEmployee(
  employee: EmployeeFormValues,
  userId: string
) {
  await addDoc(employeesCollection, {
    ...employee,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getEmployees(
  userId: string
): Promise<Employee[]> {
  const employeeQuery = query(
    employeesCollection,
    where("userId", "==", userId)
  );

  const snapshot =
    await getDocs(employeeQuery);

  const employees =
    snapshot.docs.map(
      (employeeDocument) => {
        const data =
          employeeDocument.data();

        return {
          id: employeeDocument.id,
          userId: data.userId,
          firstName: data.firstName,
          lastName: data.lastName,
          employeeId: data.employeeId,
          email: data.email,
          phone: data.phone,
          department: data.department,
          jobTitle: data.jobTitle,
          address: data.address,

          createdAt:
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate()
              : undefined,

          updatedAt:
            data.updatedAt instanceof Timestamp
              ? data.updatedAt.toDate()
              : undefined,
        };
      }
    );

  return employees.sort(
    (first, second) => {
      const firstTime =
        first.createdAt?.getTime() || 0;

      const secondTime =
        second.createdAt?.getTime() || 0;

      return secondTime - firstTime;
    }
  );
}

export async function getEmployeeById(
  employeeDocumentId: string,
  userId: string
): Promise<Employee | null> {
  const employeeReference = doc(
    db,
    "employees",
    employeeDocumentId
  );

  const employeeSnapshot =
    await getDoc(employeeReference);

  if (!employeeSnapshot.exists()) {
    return null;
  }

  const data =
    employeeSnapshot.data();

  if (data.userId !== userId) {
    return null;
  }

  return {
    id: employeeSnapshot.id,
    userId: data.userId,
    firstName: data.firstName,
    lastName: data.lastName,
    employeeId: data.employeeId,
    email: data.email,
    phone: data.phone,
    department: data.department,
    jobTitle: data.jobTitle,
    address: data.address,

    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate()
        : undefined,

    updatedAt:
      data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate()
        : undefined,
  };
}

export async function updateEmployee(
  employeeDocumentId: string,
  employee: EmployeeFormValues,
  userId: string
) {
  const existingEmployee =
    await getEmployeeById(
      employeeDocumentId,
      userId
    );

  if (!existingEmployee) {
    throw new Error(
      "Employee record not found."
    );
  }

  const employeeReference = doc(
    db,
    "employees",
    employeeDocumentId
  );

  await updateDoc(employeeReference, {
    ...employee,
    userId,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteEmployee(
  employeeDocumentId: string,
  userId: string
) {
  const existingEmployee =
    await getEmployeeById(
      employeeDocumentId,
      userId
    );

  if (!existingEmployee) {
    throw new Error(
      "Employee record not found."
    );
  }

  await deleteDoc(
    doc(
      db,
      "employees",
      employeeDocumentId
    )
  );
}