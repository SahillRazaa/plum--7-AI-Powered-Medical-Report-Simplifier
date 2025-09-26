const { levenshteinDistance } = require('../utils/levenshteinDistance');

const CONFIDENCE_THRESHOLD = 0.80;

const validateNormalization = (rawText, normalizedTests) => {
  console.log('Running sliding window validation guardrail...');
  
  const processedRawText = rawText.toLowerCase().replace(/[^a-z0-9]/g, '');

  for (const test of normalizedTests) {
    const processedTestName = test.name.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (processedRawText.length < processedTestName.length) {
      console.error(`Validation FAILED for "${test.name}". Raw text is shorter than the test name.`);
      return false;
    }

    let bestMatchScore = 0;
    
    for (let i = 0; i <= processedRawText.length - processedTestName.length; i++) {
      const windowSubstring = processedRawText.substring(i, i + processedTestName.length);
      
      const distance = levenshteinDistance(processedTestName, windowSubstring);
      const similarity = 1 - (distance / processedTestName.length);
      
      if (similarity > bestMatchScore) {
        bestMatchScore = similarity;
      }

      if (bestMatchScore === 1) {
        break;
      }
    }

    console.log(`Best match for "${test.name}": similarity score is ${bestMatchScore.toFixed(2)}`);

    if (bestMatchScore < CONFIDENCE_THRESHOLD) {
      console.error(`Validation FAILED for test "${test.name}". Best similarity score was below threshold.`);
      return false;
    }
  }

  console.log('Validation PASSED.');
  return true;
};

module.exports = {
  validateNormalization,
};