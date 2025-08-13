import classesData from "@/services/mockData/classes.json";
let classes = [...classesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAll = async () => {
  await delay(300);
  return [...classes];
};

export const getById = async (id) => {
  await delay(200);
  const cls = classes.find(c => c.Id === parseInt(id));
  if (!cls) {
    throw new Error("Class not found");
  }
  return { ...cls };
};

export const create = async (classData) => {
  await delay(400);
  const maxId = classes.length > 0 ? Math.max(...classes.map(c => c.Id)) : 0;
  const newClass = {
    Id: maxId + 1,
    ...classData,
    studentIds: classData.studentIds || [],
    createdAt: new Date().toISOString().split("T")[0]
  };
  classes.push(newClass);
  return { ...newClass };
};

export const update = async (id, classData) => {
  await delay(350);
  const index = classes.findIndex(c => c.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Class not found");
  }
  classes[index] = { ...classes[index], ...classData, Id: parseInt(id) };
  return { ...classes[index] };
};

export const deleteClass = async (id) => {
  await delay(250);
  const index = classes.findIndex(c => c.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Class not found");
  }
  classes.splice(index, 1);
  return true;
};