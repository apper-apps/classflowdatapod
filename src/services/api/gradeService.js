import gradesData from "@/services/mockData/grades.json";

let grades = [...gradesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAll = async () => {
  await delay(300);
  return [...grades];
};

export const getById = async (id) => {
  await delay(200);
  const grade = grades.find(g => g.Id === parseInt(id));
  if (!grade) {
    throw new Error("Grade not found");
  }
  return { ...grade };
};

export const create = async (gradeData) => {
  await delay(400);
  const maxId = grades.length > 0 ? Math.max(...grades.map(g => g.Id)) : 0;
  const newGrade = {
    Id: maxId + 1,
    ...gradeData,
    date: gradeData.date || new Date().toISOString().split("T")[0]
  };
  grades.push(newGrade);
  return { ...newGrade };
};

export const update = async (id, gradeData) => {
  await delay(350);
  const index = grades.findIndex(g => g.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Grade not found");
  }
  grades[index] = { ...grades[index], ...gradeData, Id: parseInt(id) };
  return { ...grades[index] };
};

export const deleteById = async (id) => {
  await delay(250);
  const index = grades.findIndex(g => g.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Grade not found");
  }
  grades.splice(index, 1);
  return true;
};