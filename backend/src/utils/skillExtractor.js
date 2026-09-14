import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});
const extractSkills = async (resumeText, jobDescription) => {

    if (!resumeText || !jobDescription) {
        throw new Error("Resume text and job description are required");
    }
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `
        Extract technical skills from the resume and job description.
        
        Return ONLY valid JSON in this format:
{
    "resumeSkills": [],
    "requiredSkills": []
}
        Resume:
        ${resumeText}
        
        Job Description:
        ${jobDescription}
        `,
        config: {
            responseMimeType: "application/json",//response needed in json
        },

    });
    const outputText = response.text;

const skills = JSON.parse(outputText);//Lekin AI ka output initially text/string hota hai. Hume JavaScript object chahiye, isliye:
return skills;
};

// Naya helper function — file ke top pe ya alag utils file mein daal sakti ho
const extractFirstJsonObject = (text) => {
    const startIndex = text.indexOf("{");
    if (startIndex === -1) return null;

    let braceCount = 0;
    let endIndex = -1;

    for (let i = startIndex; i < text.length; i++) {
        if (text[i] === "{") braceCount++;
        if (text[i] === "}") braceCount--;

        if (braceCount === 0) {
            endIndex = i;
            break;
        }
    }

    if (endIndex === -1) return null;

    return text.slice(startIndex, endIndex + 1);
};

const extractJobSkills = async (jobDescription) => {
    if (!jobDescription) {
        return [];
    }

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash", // pehle ye model name verify kar lo
        contents: `
Extract only the technical skills required in the following job description.

Return ONLY ONE JSON object in exactly this format:

{
    "skills": ["React", "Node.js", "MongoDB", "Docker"]
}

Do not return multiple objects.
Do not return multiple arrays.
Do not return explanations.
Do not return markdown.

Job Description:
${jobDescription}
`,
        config: {
            responseMimeType: "application/json",//anser json mein aye isiliye
        },
    });

    const outputText = response.text;//ye use kiya jo resp[onse aye usko text part mein nikalne ke liye]

    // Sirf pehla complete JSON object nikालो
    const cleanedJson = extractFirstJsonObject(outputText);

    if (!cleanedJson) {
        console.error("No valid JSON found in Gemini response:", outputText);
        return [];
    }

    let jobSkills;
    try {
        jobSkills = JSON.parse(cleanedJson);
    } catch (error) {
        console.error("JSON parse failed. Raw response was:", outputText);
        return [];
    }

    return jobSkills.skills || [];
};


export { extractSkills ,extractJobSkills,extractFirstJsonObject};

// resumeText + jobDescription
//         ↓
// OpenAI API
//         ↓
// response
//         ↓
// response.output_text
//         ↓
// JSON.parse()
//         ↓
// skills object
//         ↓
// return skills