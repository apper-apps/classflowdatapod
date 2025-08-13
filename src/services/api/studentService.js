import studentsData from "@/services/mockData/students.json";

let students = [...studentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAll = async () => {
  await delay(300);
  return [...students];
};

export const getById = async (id) => {
  await delay(200);
  const student = students.find(s => s.Id === parseInt(id));
  if (!student) {
    throw new Error("Student not found");
  }
  return { ...student };
};

export const create = async (studentData) => {
  await delay(400);
  const maxId = students.length > 0 ? Math.max(...students.map(s => s.Id)) : 0;
  const newStudent = {
    Id: maxId + 1,
    ...studentData,
    enrollmentDate: studentData.enrollmentDate || new Date().toISOString().split("T")[0],
    parentContacts: studentData.parentContacts || [],
    emergencyContacts: studentData.emergencyContacts || []
  };
  students.push(newStudent);
  return { ...newStudent };
};

export const update = async (id, studentData) => {
  await delay(350);
  const index = students.findIndex(s => s.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Student not found");
  }
  students[index] = { 
    ...students[index], 
    ...studentData, 
    Id: parseInt(id),
    parentContacts: studentData.parentContacts || students[index].parentContacts || [],
    emergencyContacts: studentData.emergencyContacts || students[index].emergencyContacts || []
  };
  return { ...students[index] };
};

export const remove = async (id) => {
  await delay(250);
  const index = students.findIndex(s => s.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Student not found");
  }
  students.splice(index, 1);
  return true;
};