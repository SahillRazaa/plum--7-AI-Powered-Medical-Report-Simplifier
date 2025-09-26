const geminiService = require("../../services/geminiService"); 
const ocrService = require("../../services/ocrService");
const validationService = require("../../services/validationService");

const simplifyReport = async (req, res) => {
  try {
    let rawText;

    if(req.file) {
        console.log('Processing uploaded file...');
        const imageBuffer = req.file.buffer;
        rawText = await ocrService.getTextFromImage(imageBuffer);
    }
    else if(req.body.text) {
        console.log('Processing text from request body...');
        rawText = req.body.text;
    }
    else {
      return res.status(400).json({ error: 'File or Text input is required.' });
    }

    if (!rawText || rawText.trim() === '') {
      return res.status(400).json({ error: 'Extracted text is empty. Cannot process.' });
    }

    const normalizedTests = await geminiService.getAiNormalization(rawText);

    if (normalizedTests.length === 0) {
      return res.status(200).json({
        tests: [],
        summary: "No valid medical test data was found in the provided input.",
        status: "ok"
      });
    }

    const isValid = validationService.validateNormalization(rawText, normalizedTests);

    if(!isValid) {
        return res.status(400).json({
        status: "unprocessed",
        reason: "Hallucinated tests not present in input. AI output rejected."
      });
    }

    const summaryData = await geminiService.getAiSimplification(normalizedTests);

    const finalResponse = {
      tests: normalizedTests,
      summary: summaryData,
      status: "ok"
    };

    res.status(200).json(finalResponse);

  } catch (error) {
    console.error('Error in simplifyReport controller:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

module.exports = {
  simplifyReport,
};