import { 
  create as createStudent, 
  getAll as getAllStudents, 
  getById as getStudentById, 
  update as updateStudent 
} from "@/services/api/studentService";
import { 
  create as createAttendance, 
  getAll as getAllAttendance, 
  getById as getAttendanceById, 
  update as updateAttendance 
} from "@/services/api/attendanceService";
import { 
  create as createGrade, 
  getAll as getAllGrades, 
  getById as getGradeById, 
  update as updateGrade 
} from "@/services/api/gradeService";
// Class Service - ApperClient Integration
const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'class_c';

// Fields for class_c table (only Updateable fields for create/update)
const updateableFields = [
  'Name',
  'Tags',
  'subject_c',
  'schedule_c',
  'student_ids_c',
  'created_at_c'
];

// All fields for fetch operations
const allFields = [
  { "field": { "Name": "Name" } },
  { "field": { "Name": "Tags" } },
  { "field": { "Name": "Owner" } },
  { "field": { "Name": "CreatedOn" } },
  { "field": { "Name": "CreatedBy" } },
  { "field": { "Name": "ModifiedOn" } },
  { "field": { "Name": "ModifiedBy" } },
  { "field": { "Name": "subject_c" } },
  { "field": { "Name": "schedule_c" } },
  { "field": { "Name": "student_ids_c" } },
  { "field": { "Name": "created_at_c" } }
];

export const getAll = async () => {
  try {
    const params = {
      fields: allFields,
      orderBy: [
        {
          fieldName: "CreatedOn",
          sorttype: "DESC"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching classes:", error?.response?.data?.message);
    } else {
      console.error("Error fetching classes:", error.message);
    }
    throw error;
  }
};

export const getById = async (id) => {
  try {
    const params = {
      fields: allFields
    };
    
    const response = await apperClient.getRecordById(tableName, id, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching class with ID ${id}:`, error?.response?.data?.message);
    } else {
      console.error(`Error fetching class with ID ${id}:`, error.message);
    }
    throw error;
  }
};

export const create = async (classData) => {
  try {
    // Map UI field names to database field names
    const mappedData = {
      Name: classData.Name || classData.name || '',
      Tags: classData.Tags || '',
      subject_c: classData.subject_c || classData.subject || '',
      schedule_c: classData.schedule_c || classData.schedule || '',
      student_ids_c: classData.student_ids_c || classData.studentIds?.join(',') || '',
      created_at_c: classData.created_at_c || new Date().toISOString().split('T')[0]
    };
    
    const params = {
      records: [mappedData]
    };
    
    const response = await apperClient.createRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create class ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to create class');
      }
      
      return successfulRecords[0]?.data;
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating class:", error?.response?.data?.message);
    } else {
      console.error("Error creating class:", error.message);
    }
    throw error;
  }
};

export const update = async (id, classData) => {
  try {
    // Map UI field names to database field names
    const mappedData = {
      Id: parseInt(id),
      Name: classData.Name || classData.name || '',
      Tags: classData.Tags || '',
      subject_c: classData.subject_c || classData.subject || '',
      schedule_c: classData.schedule_c || classData.schedule || '',
      student_ids_c: classData.student_ids_c || classData.studentIds?.join(',') || '',
      created_at_c: classData.created_at_c || ''
    };
    
    const params = {
      records: [mappedData]
    };
    
    const response = await apperClient.updateRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update class ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        throw new Error(failedUpdates[0].message || 'Failed to update class');
      }
      
      return successfulUpdates[0]?.data;
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating class:", error?.response?.data?.message);
    } else {
      console.error("Error updating class:", error.message);
    }
    throw error;
  }
};

export const deleteClass = async (id) => {
  try {
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete class ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        throw new Error(failedDeletions[0].message || 'Failed to delete class');
      }
      
      return successfulDeletions.length > 0;
    }
    
    return true;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting class:", error?.response?.data?.message);
    } else {
      console.error("Error deleting class:", error.message);
    }
    throw error;
  }
};
// Export deleteClass as the main delete function
// Note: 'delete' is a reserved keyword and cannot be used as an export name
export { deleteClass as remove };