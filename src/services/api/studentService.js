import { 
  create as createClass, 
  getAll as getAllClasses, 
  getById as getClassById, 
  update as updateClass 
} from "@/services/api/classService";
import { 
  create as createAttendance, 
  getAll as getAllAttendance, 
  getById as getAttendanceById, 
  remove as removeAttendance, 
  update as updateAttendance 
} from "@/services/api/attendanceService";
import { 
  create as createGrade, 
  getAll as getAllGrades, 
  getById as getGradeById, 
  update as updateGrade 
} from "@/services/api/gradeService";
// Student Service - ApperClient Integration
const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'student_c';

// Fields for student_c table (only Updateable fields for create/update)
const updateableFields = [
  'Name',
  'Tags', 
  'first_name_c',
  'last_name_c',
  'email_c',
  'phone_c',
  'date_of_birth_c',
  'enrollment_date_c',
  'status_c',
  'class_ids_c'
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
  { "field": { "Name": "first_name_c" } },
  { "field": { "Name": "last_name_c" } },
  { "field": { "Name": "email_c" } },
  { "field": { "Name": "phone_c" } },
  { "field": { "Name": "date_of_birth_c" } },
  { "field": { "Name": "enrollment_date_c" } },
  { "field": { "Name": "status_c" } },
  { "field": { "Name": "class_ids_c" } }
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
      console.error("Error fetching students:", error?.response?.data?.message);
    } else {
      console.error("Error fetching students:", error.message);
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
      console.error(`Error fetching student with ID ${id}:`, error?.response?.data?.message);
    } else {
      console.error(`Error fetching student with ID ${id}:`, error.message);
    }
    throw error;
  }
};

export const create = async (studentData) => {
  try {
    // Filter to only include updateable fields
    const filteredData = {};
    updateableFields.forEach(field => {
      if (studentData[field] !== undefined) {
        filteredData[field] = studentData[field];
      }
    });
    
    // Map UI field names to database field names
    const mappedData = {
      Name: studentData.Name || `${studentData.first_name_c || ''} ${studentData.last_name_c || ''}`.trim(),
      Tags: studentData.Tags || '',
      first_name_c: studentData.first_name_c || '',
      last_name_c: studentData.last_name_c || '',
      email_c: studentData.email_c || '',
      phone_c: studentData.phone_c || '',
      date_of_birth_c: studentData.date_of_birth_c || '',
      enrollment_date_c: studentData.enrollment_date_c || new Date().toISOString().split('T')[0],
      status_c: studentData.status_c || 'active',
      class_ids_c: studentData.class_ids_c || ''
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
        console.error(`Failed to create student ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to create student');
      }
      
      return successfulRecords[0]?.data;
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating student:", error?.response?.data?.message);
    } else {
      console.error("Error creating student:", error.message);
    }
    throw error;
  }
};

export const update = async (id, studentData) => {
  try {
    // Map UI field names to database field names
    const mappedData = {
      Id: parseInt(id),
      Name: studentData.Name || `${studentData.first_name_c || ''} ${studentData.last_name_c || ''}`.trim(),
      Tags: studentData.Tags || '',
      first_name_c: studentData.first_name_c || '',
      last_name_c: studentData.last_name_c || '',
      email_c: studentData.email_c || '',
      phone_c: studentData.phone_c || '',
      date_of_birth_c: studentData.date_of_birth_c || '',
      enrollment_date_c: studentData.enrollment_date_c || '',
      status_c: studentData.status_c || 'active',
      class_ids_c: studentData.class_ids_c || ''
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
        console.error(`Failed to update student ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        throw new Error(failedUpdates[0].message || 'Failed to update student');
      }
      
      return successfulUpdates[0]?.data;
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating student:", error?.response?.data?.message);
    } else {
      console.error("Error updating student:", error.message);
    }
    throw error;
  }
};

export const remove = async (id) => {
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
        console.error(`Failed to delete student ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        throw new Error(failedDeletions[0].message || 'Failed to delete student');
      }
      
      return successfulDeletions.length > 0;
    }
    
    return true;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting student:", error?.response?.data?.message);
    } else {
      console.error("Error deleting student:", error.message);
    }
    throw error;
  }
};
// Note: 'delete' is a reserved keyword in JavaScript
// Use the 'remove' function directly instead