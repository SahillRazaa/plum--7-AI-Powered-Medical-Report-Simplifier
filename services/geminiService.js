const dotenv = require('dotenv');
dotenv.config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getNormalizationPrompt } = require('../utils/normalizedPrompt');
const { getSimplificationPrompt } = require('../utils/simplifiedPrompt');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const callGenerativeAIWithRetry = async (model, prompt, retries = 3) => {
  let lastError = null;
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response;
    } catch (error) {
      lastError = error;
      if (error.message.includes('[503 Service Unavailable]') || error.message.includes('[500 Internal Server Error]')) {
        console.log(`Attempt ${i + 1} failed with a server error. Retrying in ${Math.pow(2, i)}s...`);
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      } else {
        throw error;
      }
    }
  }
  throw new Error(`AI API call failed after ${retries} attempts. Last error: ${lastError.message}`);
};

const getAiNormalization = async (rawText) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { responseMimeType: "application/json" },
    });
    const prompt = getNormalizationPrompt(rawText);
    const response = await callGenerativeAIWithRetry(model, prompt);
    const result = JSON.parse(response.text());

    if (Array.isArray(result)) {
      return result;
    }
    if (result && Array.isArray(result.tests)) {
      return result.tests;
    }
    return [];
  } catch (error) {
    console.error("Error in getAiNormalization after retries:", error);
    return [];
  }
};

const getAiSimplification = async (testsJson) => {
  try {
    const textModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = getSimplificationPrompt(testsJson);
    const response = await callGenerativeAIWithRetry(textModel, prompt);
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API for simplification after retries:", error);
    throw new Error("Failed to get summary from AI.");
  }
};

module.exports = {
  getAiNormalization,
  getAiSimplification
};