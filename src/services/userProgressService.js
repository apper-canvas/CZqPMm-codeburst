/**
 * Service for handling user progress data
 */

// Get user progress
export async function getUserProgress(userId) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "user_id" } },
        { Field: { Name: "current_step" } },
        { Field: { Name: "completed_steps" } },
        { Field: { Name: "last_accessed" } }
      ],
      where: [
        {
          fieldName: "user_id",
          Operator: "ExactMatch",
          values: [userId]
        },
        {
          fieldName: "IsDeleted",
          Operator: "ExactMatch",
          values: [false]
        }
      ],
      pagingInfo: {
        limit: 1
      }
    };
    
    const response = await apperClient.fetchRecords("user_progress", params);
    
    if (!response || !response.data || response.data.length === 0) {
      // User doesn't have progress yet, create a new record
      const newProgress = await createUserProgress(userId);
      return newProgress;
    }
    
    return response.data[0];
  } catch (error) {
    console.error("Error fetching user progress:", error);
    throw error;
  }
}

// Create initial user progress record
export async function createUserProgress(userId) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      records: [
        {
          Name: `Progress for ${userId}`,
          user_id: userId,
          current_step: 0,
          completed_steps: "intro",
          last_accessed: new Date().toISOString()
        }
      ]
    };
    
    const response = await apperClient.createRecord("user_progress", params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    } else {
      throw new Error("Failed to create user progress record");
    }
  } catch (error) {
    console.error("Error creating user progress:", error);
    throw error;
  }
}

// Update user progress
export async function updateUserProgress(recordId, updates) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      records: [
        {
          Id: recordId,
          ...updates,
          last_accessed: new Date().toISOString()
        }
      ]
    };
    
    const response = await apperClient.updateRecord("user_progress", params);
    return response.success;
  } catch (error) {
    console.error("Error updating user progress:", error);
    throw error;
  }
}