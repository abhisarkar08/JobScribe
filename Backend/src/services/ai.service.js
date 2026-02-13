const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function extractSkillsWithAI(resumeText) {
  // Model name ko full path ke saath likha hai
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

  const prompt = `
    Extract ONLY technical and professional skills from this resume.
    Return a valid JSON array of strings. 
    Example: ["Java", "Python", "React"]
    Strictly No markdown, no backticks, no text before or after the JSON.

    Resume:
    ${resumeText}
  `;

  try {
    const result = await model.generateContent(prompt);
    let response = result.response.text();

    console.log("RAW AI RESPONSE:", response);

    // 🔥 Sabse safe tarika JSON nikalne ka (Markdown backticks ignore karne ke liye)
    const jsonMatch = response.match(/\[[\s\S]*\]/); 
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return JSON.parse(response); // Fallback agar clean JSON ho

  } catch (err) {
    console.error("AI PARSING ERROR:", err.message);
    return [];
  }
}

async function analyzeJD(jdText) {
  console.log("JD route hit");

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    Extract the following from the job description and return ONLY valid JSON.

    {
      "requiredSkills": [],
      "softSkills": [],
      "tools": [],
      "experienceLevel": "",
      "keywords": []
    }

    Job Description:
    ${jdText}
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    console.log("RAW JD AI RESPONSE:", response);

    // ✅ Remove markdown backticks
    let cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // ✅ Extract only JSON object
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error("Invalid JSON format from AI");

  } catch (error) {
    console.error("JD Analysis Error:", error.message);
    throw error;
  }
}


module.exports = { extractSkillsWithAI, analyzeJD };
