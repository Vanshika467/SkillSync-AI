import { GoogleGenAI } from "@google/genai";
import { extractFirstJsonObject } from "../utils/skillExtractor.js";
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const generateRoadmap = async (missingSkills) => {// here missingskills name idya hian topmissing skills ko hi 
    if (!missingSkills || missingSkills.length === 0) {
        return null;
    }
    const skillsList = missingSkills.map((item) => item.skill).join(", ");
//yaha upar hamne skillsn or coutn week 5 mein jo the usne skills nikal ke array of objects se simplse array bana rahe bhaiun 
   //skilllist se direct skill daldi misisng using temperalliteral
const prompt = `
You are a career mentor creating a personalized learning roadmap.

The user is missing these skills: ${skillsList}


Create a week-by-week learning roadmap, one week per skill, to help the user learn these skills in order of importance.

Return ONLY ONE JSON object in exactly this format:

{
  "weeks": [
    {
      "weekNumber": 1,
      "focusSkill": "Docker",
      "description": "short 1-2 line explanation of what to learn this week",
      "resources": [
        { "title": "Docker Official Docs", "url": "https://docs.docker.com" },
        { "title": "Docker Crash Course video", "url": "https://youtube.com/example" }
      ],
      "practiceProject": "short practice project idea using this skill",
      "leetcodeTopics": ["Arrays", "Recursion"]
    }
  ]
}

Do not return explanations outside the JSON.
Do not return markdown formatting.
Do not return multiple JSON objects.
`;
const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
        responseMimeType: "application/json",
    },
});

const outputText = response.text;//gemini ka rawtext response nikala

const cleanedJson = extractFirstJsonObject(outputText);

if (!cleanedJson) {
    console.error("No valid JSON found in Gemini roadmap response:", outputText);
    return null;
}

let roadmapData;
try {
    roadmapData = JSON.parse(cleanedJson);// isme error aa skata 
} catch (error) {
    console.error("JSON parse failed for roadmap. Raw response was:", outputText);
    return null;
}

return roadmapData.weeks || [];
};

export { generateRoadmap };