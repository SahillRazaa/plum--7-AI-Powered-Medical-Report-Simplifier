const getNormalizationPrompt = (rawText) => {
  return `
  Analyze the following raw text from a medical report. Extract all medical tests and their details.
  
  **IMPORTANT:** For each test, if the reference range is not mentioned in the text, use your knowledge to provide the standard, common reference range for an adult.

  Your response MUST be a valid JSON object which is an array of tests, following this exact schema: 
  [{"name": "string","value": "number","unit": "string","status": "string","ref_range": { "low": "number", "high": "number" }}].

  Do not include any tests not explicitly mentioned in the text. Raw Text: "${rawText}"`;
};

module.exports = {
  getNormalizationPrompt,
};