import Vapi from "@vapi-ai/web";

const apiKey = process.env.REACT_APP_VAPI_API_KEY;
const assistantId = process.env.REACT_APP_ASSISTANT_ID;

export const vapi = new Vapi(apiKey);

export const startAssistant = async (name, position, years_of_experience, technology) => {
  try {
    const assistantOverrides = {
      variableValues: { name, position, years_of_experience, technology }
    };
    return await vapi.start(assistantId, assistantOverrides);
  } catch (err) {
    console.error("Failed to start assistant:", err);
    throw err;
  }
};

export const stopAssistant = () => {
  vapi.stop();
};
