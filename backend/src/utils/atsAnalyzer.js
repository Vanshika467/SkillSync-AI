const analyzeSections = (extractedText) => {

    const lowerText = extractedText.toLowerCase();

    const sections = [
        "education",
        "skills",
        "experience",
        "projects"
    ];
    const missingSections = sections.filter(
        (section) => !lowerText.includes(section)
    );
    
    const foundSections = sections.length - missingSections.length;
    const sectionScore = Math.round(
        (foundSections / sections.length) * 25
    );
    
    return { sectionScore,
         missingSections 
        };
};
const analyzeContact = (extractedText) => {

    const hasEmail = /\S+@\S+\.\S+/.test(extractedText);

    const hasLinkedIn = extractedText
        .toLowerCase()
        .includes("linkedin");
  
    const hasPhone = /(\+?\d[\d\s-]{8,}\d)/.test(extractedText);

const hasGitHub = extractedText
    .toLowerCase()
    .includes("github");  
const contactChecks = [
        hasEmail,//true
        hasPhone,//true
        hasLinkedIn,//faklse
        hasGitHub//true
    ];
    
    const foundContacts = contactChecks.filter(Boolean).length;//3
    const contactScore = Math.round(
        (foundContacts / contactChecks.length) * 25
    );
    
    return { contactScore };

};
const analyzeContent = (extractedText) => {

    const words = extractedText.trim().split(/\s+/);//extra space hatake text ko word mein tod rahe hain 

    const wordCount = words.length;
    let contentScore = 0;

if (wordCount >= 300 && wordCount <= 800) {
    contentScore = 25;
} else if (wordCount >= 200) {
    contentScore = 18;
}
const suggestions = [];

if (wordCount < 200) {
    contentScore = 10;
    suggestions.push("Resume content is too short. Add more relevant details.");
}
if (wordCount > 800) {
    suggestions.push(
        "Resume is too lengthy. Keep the content concise and relevant."
    );
}

return { contentScore, suggestions };
};
const analyzeKeywords = (extractedText, jobDescription) => {

    const resumeText = extractedText.toLowerCase();
    const jdText = jobDescription.toLowerCase();

};
const analyzeATS = (extractedText) => {

    const sectionResult = analyzeSections(extractedText);

    const contactResult = analyzeContact(extractedText);

    const contentResult = analyzeContent(extractedText);

    const baseScore =
    sectionResult.sectionScore +
    contactResult.contactScore +
    contentResult.contentScore;
    return {
        baseScore,
        sectionScore: sectionResult.sectionScore,
        contactScore: contactResult.contactScore,
        contentScore: contentResult.contentScore,
        missingSections: sectionResult.missingSections,
        suggestions: contentResult.suggestions
    };

};
export { analyzeATS };
