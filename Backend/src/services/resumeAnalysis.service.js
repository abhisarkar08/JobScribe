function extractSkillSection(text) {
  const lines = text.split("\n").map((l) => l.trim());

  let capturing = false;
  let skillsBlock = [];

  for (let line of lines) {
    if (/^(technical\s+)?skills$|^key\s+skills$/i.test(line)) {
      capturing = true;
      continue;
    }
    if (
      capturing &&
      /education|experience|projects|achievements|certifications|summary/i.test(
        line,
      )
    ) {
      break;
    }

    if (capturing && line.length > 0) {
      skillsBlock.push(line);
    }
  }

  if (!skillsBlock.length) return [];

  let skills = [];

  skillsBlock.forEach((line) => {
    if (line.includes(":")) {
      const rightSide = line.split(":")[1];
      if (rightSide) {
        skills.push(...rightSide.split(",").map((s) => s.trim()));
      }
    }
    else {
      const cleaned = line.replace(/^[•\-\*]\s*/, ""); // Bullets hatana
      skills.push(...cleaned.split(",").map((s) => s.trim()));
    }
  });

  return [
    ...new Set(
      skills.filter(
        (s) =>
          s.length > 1 &&
          !/\d{4}/.test(s) &&
          !s.includes("@") &&
          !/github|linkedin|http/i.test(s),
      ),
    ),
  ];
}

function extractEmail(text) {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : null;
}

function extractPhone(text) {
  const match = text.match(
    /(?:\+?\d{1,3}[- ]?)?\(?\d{2,5}\)?[- ]?\d{2,5}[- ]?\d{2,5}[- ]?\d{2,5}/,
  );
  return match ? match[0].trim() : null;
}

function hasSection(text, sectionName) {
  const patterns = {
    education: /education|academic|qualification|schooling/i,
    project: /projects?|personal work|portfolio/i,
    experience: /experience|employment|work history|internship/i,
  };

  const regex = patterns[sectionName.toLowerCase()];
  return regex ? regex.test(text) : false;
}

function calculateScore({ skills, email, phone, text }) {
  let score = 0;

  if (skills.length >= 8) score += 25;
  else if (skills.length >= 4) score += 15;
  else if (skills.length > 0) score += 10;

  if (hasSection(text, "education")) score += 25;
  if (hasSection(text, "project")) score += 25;
  if (hasSection(text, "experience")) score += 25;

  if (email && phone) score += 10;

  return Math.min(score, 100);
}

function resumeAnalysis(text) {
  const skills = extractSkillSection(text);
  const email = extractEmail(text);
  const phone = extractPhone(text);

  const sections = {
    education: hasSection(text, "education"),
    projects: hasSection(text, "project"),
    experience: hasSection(text, "experience"),
  };

  return {
    skills,
    email,
    phone,
    sections,
    score: calculateScore({ skills, email, phone, text }),
  };
}

module.exports = { resumeAnalysis, calculateScore };
