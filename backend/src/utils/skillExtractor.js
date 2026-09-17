import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});


// ==================== EXTRACT SKILLS FOR ATS ====================

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
            responseMimeType: "application/json", //response needed in json
        },

    });

    const outputText = response.text;

    const skills = JSON.parse(outputText); //Lekin AI ka output initially text/string hota hai. Hume JavaScript object chahiye, isliye:

    return skills;
};


// ==================== JSON HELPER FUNCTION ====================

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


// ==================== EXTRACT SKILLS FOR SINGLE JOB ====================

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
            responseMimeType: "application/json", //answer json mein aye isiliye
        },
    });

    const outputText = response.text; //ye use kiya jo response aye usko text part mein nikalne ke liye

    // Sirf pehla complete JSON object nikalo
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


// ==================== EXTRACT SKILLS FOR MULTIPLE JOBS ====================
// Ye naya function hai.
// Pehle 5 jobs ke liye 5 Gemini API calls ho rahi thi.
// Ab 5 jobs ko ek saath bhejkar sirf 1 Gemini API call karenge.

const extractSkillsForMultipleJobs = async (jobs) => {

    if (!jobs || jobs.length === 0) {
        return [];
    }

    const jobsText = jobs.map((job, index) => `
JOB ${index + 1}
ID: ${job.externalJobId}
DESCRIPTION:
${job.description}
`).join("\n\n");

    const response = await ai.models.generateContent({

        model: "gemini-3.5-flash",

        contents: `
Extract only the technical skills required for each job.

Return ONLY valid JSON in exactly this format:

{
    "jobs": [
        {
            "externalJobId": "job-id",
            "skills": ["React", "Node.js", "MongoDB"]
        }
    ]
}

Do not return explanations.
Do not return markdown.
Do not return multiple JSON objects.

${jobsText}
`,

        config: {
            responseMimeType: "application/json",
        },
    });

    const outputText = response.text;

    // Gemini ka response initially text/string hota hai.
    // JSON.parse() se usko JavaScript object mein convert karenge.

    const cleanedJson = extractFirstJsonObject(outputText);

    if (!cleanedJson) {
        console.error(
            "No valid JSON found in Gemini multiple jobs response:",
            outputText
        );

        return [];
    }

    try {

        const result = JSON.parse(cleanedJson);

        return result.jobs || [];

    } catch (error) {

        console.error(
            "JSON parse failed for multiple jobs. Raw response was:",
            outputText
        );

        return [];
    }
};


// ==================== EXPORTS ====================

export {
    extractSkills,
    extractJobSkills,
    extractSkillsForMultipleJobs,
    extractFirstJsonObject
};


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