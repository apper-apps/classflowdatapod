// Grade Service - ApperClient Integration
// Grade Service - ApperClient Integration
const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'grade_c';

// Fields for grade_c table (only Updateable fields for create/update)
const updateableFields = [
  'Name',
  'Tags',
  'assignment_name_c',
  'score_c',
  'max_score_c',
  'date_c',
  'type_c',
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
  { "field": { "Name": "assignment_name_c" } },
  { "field": { "Name": "score_c" } },
  { "field": { "Name": "max_score_c" } },
  { "field": { "Name": "date_c" } },
  { "field": { "Name": "type_c" } },
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
      console.error("Error fetching grades:", error?.response?.data?.message);
    } else {
      console.error("Error fetching grades:", error.message);
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
      console.error(`Error fetching grade with ID ${id}:`, error?.response?.data?.message);
    } else {
      console.error(`Error fetching grade with ID ${id}:`, error.message);
    }
    throw error;
  }
};

export const create = async (gradeData) => {
  try {
    // Map UI field names to database field names
    const mappedData = {
      Name: gradeData.Name || gradeData.assignment_name_c || gradeData.assignmentName || '',
      Tags: gradeData.Tags || '',
      assignment_name_c: gradeData.assignment_name_c || gradeData.assignmentName || '',
      score_c: parseFloat(gradeData.score_c || gradeData.score || 0),
      max_score_c: parseFloat(gradeData.max_score_c || gradeData.maxScore || 100),
      date_c: gradeData.date_c || gradeData.date || new Date().toISOString().split('T')[0],
      type_c: gradeData.type_c || gradeData.type || 'assignment',
      student_id_c: parseInt(gradeData.student_id_c || gradeData.studentId),
      class_id_c: parseInt(gradeData.class_id_c || gradeData.classId)
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
        console.error(`Failed to create grade ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to create grade');
      }
      
      return successfulRecords[0]?.data;
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating grade:", error?.response?.data?.message);
    } else {
      console.error("Error creating grade:", error.message);
    }
    throw error;
  }
};

export const update = async (id, gradeData) => {
  try {
    // Map UI field names to database field names
    const mappedData = {
      Id: parseInt(id),
      Name: gradeData.Name || gradeData.assignment_name_c || gradeData.assignmentName || '',
      Tags: gradeData.Tags || '',
      assignment_name_c: gradeData.assignment_name_c || gradeData.assignmentName || '',
      score_c: parseFloat(gradeData.score_c || gradeData.score || 0),
      max_score_c: parseFloat(gradeData.max_score_c || gradeData.maxScore || 100),
      date_c: gradeData.date_c || gradeData.date || '',
      type_c: gradeData.type_c || gradeData.type || 'assignment',
      student_id_c: parseInt(gradeData.student_id_c || gradeData.studentId),
      class_id_c: parseInt(gradeData.class_id_c || gradeData.classId)
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
        console.error(`Failed to update grade ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        throw new Error(failedUpdates[0].message || 'Failed to update grade');
      }
      
      return successfulUpdates[0]?.data;
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating grade:", error?.response?.data?.message);
    } else {
      console.error("Error updating grade:", error.message);
    }
    throw error;
  }
};

export const deleteById = async (id) => {
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
        console.error(`Failed to delete grade ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        throw new Error(failedDeletions[0].message || 'Failed to delete grade');
      }
      
      return successfulDeletions.length > 0;
    }
    
    return true;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting grade:", error?.response?.data?.message);
    } else {
      console.error("Error deleting grade:", error.message);
    }
    throw error;
  }
};
// Alias for backward compatibility - use deleteById directly
export { deleteById as remove };