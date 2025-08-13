// Attendance Service - ApperClient Integration
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'attendance_c';

// Fields for attendance_c table (only Updateable fields for create/update)
const updateableFields = [
  'Name',
  'Tags',
  'date_c',
  'status_c',
  'notes_c',
  'student_id_c',
  'class_id_c'
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
  { "field": { "Name": "date_c" } },
  { "field": { "Name": "status_c" } },
  { "field": { "Name": "notes_c" } },
  { "field": { "Name": "student_id_c" } },
  { "field": { "Name": "class_id_c" } }
];

export const getAll = async () => {
  try {
    const params = {
      fields: allFields,
      orderBy: [
        {
          fieldName: "date_c",
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
      console.error("Error fetching attendance:", error?.response?.data?.message);
    } else {
      console.error("Error fetching attendance:", error.message);
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
      console.error(`Error fetching attendance with ID ${id}:`, error?.response?.data?.message);
    } else {
      console.error(`Error fetching attendance with ID ${id}:`, error.message);
    }
    throw error;
  }
};

export const create = async (attendanceData) => {
  try {
    // Map UI field names to database field names
    const mappedData = {
      Name: attendanceData.Name || `Attendance-${new Date().toISOString().split('T')[0]}`,
      Tags: attendanceData.Tags || '',
      date_c: attendanceData.date_c || attendanceData.date || new Date().toISOString().split('T')[0],
      status_c: attendanceData.status_c || attendanceData.status || 'present',
      notes_c: attendanceData.notes_c || attendanceData.notes || '',
      student_id_c: parseInt(attendanceData.student_id_c || attendanceData.studentId),
      class_id_c: parseInt(attendanceData.class_id_c || attendanceData.classId || 1)
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
        console.error(`Failed to create attendance ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to create attendance');
      }
      
      return successfulRecords[0]?.data;
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating attendance:", error?.response?.data?.message);
    } else {
      console.error("Error creating attendance:", error.message);
    }
    throw error;
  }
};

export const update = async (id, attendanceData) => {
  try {
    // Map UI field names to database field names
    const mappedData = {
      Id: parseInt(id),
      Name: attendanceData.Name || `Attendance-${new Date().toISOString().split('T')[0]}`,
      Tags: attendanceData.Tags || '',
      date_c: attendanceData.date_c || attendanceData.date || '',
      status_c: attendanceData.status_c || attendanceData.status || '',
      notes_c: attendanceData.notes_c || attendanceData.notes || '',
      student_id_c: parseInt(attendanceData.student_id_c || attendanceData.studentId),
      class_id_c: parseInt(attendanceData.class_id_c || attendanceData.classId || 1)
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
        console.error(`Failed to update attendance ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        throw new Error(failedUpdates[0].message || 'Failed to update attendance');
      }
      
      return successfulUpdates[0]?.data;
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating attendance:", error?.response?.data?.message);
    } else {
      console.error("Error updating attendance:", error.message);
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
        console.error(`Failed to delete attendance ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        throw new Error(failedDeletions[0].message || 'Failed to delete attendance');
      }
      
      return successfulDeletions.length > 0;
    }
    
    return true;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting attendance:", error?.response?.data?.message);
    } else {
      console.error("Error deleting attendance:", error.message);
    }
    throw error;
  }
};