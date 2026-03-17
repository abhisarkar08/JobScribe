const { resumeAnalysis, calculateScore } = require("./resumeAnalysis.service");
const { extractSkillsWithAI } = require("./ai.service");

async function analyzeWithFallback(text) {
  let analysis = resumeAnalysis(text);

  if (analysis.skills.length < 3) {
    const aiSkills = await extractSkillsWithAI(text);

    if (aiSkills && aiSkills.length > 0) {
      analysis.skills = aiSkills;

      analysis.score = calculateScore({
        skills: analysis.skills,
        email: analysis.email,
        phone: analysis.phone,
        text: text,
      });
    }
  }

  return analysis;
}

module.exports = { analyzeWithFallback };
