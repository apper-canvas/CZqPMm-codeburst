/**
 * Service for handling tutorial step data
 */

// Fetch all tutorial steps from the database
export async function fetchTutorialSteps() {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      Fields: [
        {
          Field: {
            Name: "Id"
          }
        },
        {
          Field: {
            Name: "id"
          }
        },
        {
          Field: {
            Name: "title"
          }
        },
        {
          Field: {
            Name: "description"
          }
        },
        {
          Field: {
            Name: "active"
          }
        },
        {
          Field: {
            Name: "order"
          }
        },
        {
          Field: {
            Name: "content"
          }
        },
        {
          Field: {
            Name: "code_example"
          }
        }
      ],
      orderBy: [
        {
          field: "order",
          direction: "ASC"
        }
      ],
      where: [
        {
          fieldName: "IsDeleted",
          Operator: "ExactMatch",
          values: [false]
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("tutorial_step", params);
    
    if (!response || !response.data || response.data.length === 0) {
      // If no data is returned, use default steps for development
      return [
        {
          id: "intro",
          title: "Introduction to JavaScript",
          description: "JavaScript is a programming language that powers the dynamic behavior on websites. Let's start with the classic 'Hello World' example.",
          active: true,
          order: 1,
          content: "JavaScript is a versatile programming language that runs in web browsers. It allows you to create interactive websites and applications."
        },
        {
          id: "hello-world",
          title: "Hello World",
          description: "The traditional first program in any language. We'll use console.log() to output text to the console.",
          active: false,
          order: 2,
          code_example: "console.log('Hello, World!');"
        }
      ];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching tutorial steps:", error);
    throw error;
  }
}

// Get a specific tutorial step by ID
export async function getTutorialStepById(stepId) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.getRecordById("tutorial_step", stepId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tutorial step with ID ${stepId}:`, error);
    throw error;
  }
}