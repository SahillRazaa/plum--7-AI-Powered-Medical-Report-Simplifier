const Tesseract = require('tesseract.js');
const sharp = require('sharp');

const getTextFromImage = async (imageBuffer) => {
  try {
    console.log('Starting image pre-processing with sharp...');

    const processedImageBuffer = await sharp(imageBuffer)
      .grayscale() 
      .normalize() 
      .sharpen()  
      .toBuffer(); 

    console.log('Image pre-processing complete. Starting OCR process...');
    
    const result = await Tesseract.recognize(
      processedImageBuffer,
      'eng',
      { logger: m => console.log(m) }
    );
    
    console.log('OCR process completed.');
    return result.data.text;
  } catch (error) {
    console.error('Error during OCR processing:', error);
    throw new Error('Failed to extract text from image.');
  }
};

module.exports = {
  getTextFromImage,
};

