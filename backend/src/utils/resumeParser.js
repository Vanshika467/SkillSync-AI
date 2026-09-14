import fs from "fs";//file ko read karne ke kaam ayega
import { PDFParse } from "pdf-parse";

const extractTextFromPDF = async (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);

const parser = new PDFParse({ data: dataBuffer });
const result = await parser.getText();

return result.text;
 //public/temp/resume.pdf
// ↓
// fs.readFileSync()
//         ↓
// dataBuffer
//         ↓
// PDFParse
//         ↓
// getText()
//         ↓
// "Skills: React, Node.js, C++..."
};

export { extractTextFromPDF };