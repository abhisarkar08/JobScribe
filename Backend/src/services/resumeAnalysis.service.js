function extractSkillSection(text) {
  const match = text.match(
    /technical skills([\s\S]*?)(education|experience|project|$)/i
  );

  if (!match) return [];

  const section = match[1];

  const skills = section
    .split(/,|\n|•|:/)
    .map(s => s.trim())
    .filter(s => s.length > 2)
    .filter(s =>
      !/languages|tools|technologies|education|experience|project/i.test(s)
    );

  return [...new Set(skills)];
}

function extractEmail(text) {
  const match = text.match(/\S+@\S+\.\S+/);
  return match ? match[0] : null;
}

function extractPhone(text) {
  const match = text.match(/\+?\d[\d -]{8,12}\d/);
  return match ? match[0] : null;
}

function hasSection(text, sectionName) {
  const regex = new RegExp(sectionName, "i");
  return regex.test(text);
}

function calculateScore({ skills, email, phone, text }) {
  let score = 0;

  if (skills.length >= 3) score += 25;
  if (hasSection(text, "education")) score += 25;
  if (hasSection(text, "project")) score += 25;
  if (email && phone) score += 25;

  return score;
}

function resumeAnalysis(text) {
  const skills = extractSkillSection(text);
  const email = extractEmail(text);
  const phone = extractPhone(text);

  const score = calculateScore({
    skills,
    email,
    phone,
    text
  });

  return {
    skills,
    email,
    phone,
    sections: {
      education: hasSection(text, "education"),
      projects: hasSection(text, "project"),
      experience: hasSection(text, "experience")
    },
    score
  };
}

module.exports = { resumeAnalysis };
