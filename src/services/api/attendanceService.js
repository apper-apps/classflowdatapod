import attendanceData from "@/services/mockData/attendance.json";

let attendance = [...attendanceData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAll = async () => {
  await delay(300);
  return [...attendance];
};

export const getById = async (id) => {
  await delay(200);
  const record = attendance.find(a => a.Id === parseInt(id));
  if (!record) {
    throw new Error("Attendance record not found");
  }
  return { ...record };
};

export const create = async (attendanceRecord) => {
  await delay(400);
  const maxId = attendance.length > 0 ? Math.max(...attendance.map(a => a.Id)) : 0;
  const newRecord = {
    Id: maxId + 1,
    ...attendanceRecord,
    date: attendanceRecord.date || new Date().toISOString()
  };
  attendance.push(newRecord);
  return { ...newRecord };
};

export const update = async (id, attendanceRecord) => {
  await delay(350);
  const index = attendance.findIndex(a => a.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Attendance record not found");
  }
  attendance[index] = { ...attendance[index], ...attendanceRecord, Id: parseInt(id) };
  return { ...attendance[index] };
return { ...attendance[index] };
};

export const remove = async (id) => {
  await delay(250);
  const index = attendance.findIndex(a => a.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Attendance record not found");
  }
  attendance.splice(index, 1);
  return true;
};