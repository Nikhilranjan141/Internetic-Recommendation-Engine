
// src/data/chatbotData.js
// import { allInternships } from './internshipsData'; // Aapke internships data

export const getBotResponse = (userMessage, userSkills = []) => {
  const lowerMessage = userMessage.toLowerCase().trim();
  
  // Skill-based internship recommendation
  if (/(recommend|suggest|find).*internship|internship.*skill|skill.*internship/i.test(lowerMessage)) {
    return getSkillBasedRecommendations(userSkills);
  }

  if (/(my skill|my skills|add skill|update skill)/i.test(lowerMessage)) {
    return `I can help you with skill-based recommendations! Currently I see you have these skills: ${userSkills.join(', ') || 'none'}. You can say "Recommend internships for React" or "Find internships matching my skills".`;
  }

  // Existing responses...
};

// Skill-based recommendation function
const getSkillBasedRecommendations = (userSkills) => {
  if (!userSkills || userSkills.length === 0) {
    return `I'd love to recommend internships based on your skills! But I don't see any skills in your profile yet. 😊

To get personalized recommendations:
1. Go to your Profile page
2. Add your technical skills (like React, Python, Marketing, etc.)
3. Come back and ask me "Recommend internships for my skills"

Or you can tell me your skills directly! Try saying:
- "I know React and JavaScript"
- "Recommend internships for Python developers"
- "Find me marketing internships"`;
  }

  const matchingInternships = allInternships.filter(internship => {
    return internship.skills.some(skill => 
      userSkills.some(userSkill => 
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
  });

  if (matchingInternships.length === 0) {
    return `I searched through all internships but couldn't find perfect matches for your skills: **${userSkills.join(', ')}**.

Try these options:
1. **Broaden your skills** - Learn related technologies
2. **Check all internships** - Some might still be a good fit
3. **Update your profile** - Add more skills to get better matches

You can also ask me:
- "Show all technology internships"
- "What skills are in demand?"
- "Help me improve my skill set"`;
  }

  const topMatches = matchingInternships.slice(0, 3); // Show top 3 matches

  let response = `🎯 **Perfect! I found ${matchingInternships.length} internships matching your skills: ${userSkills.join(', ')}**\n\n`;

  topMatches.forEach((internship, index) => {
    const matchScore = calculateMatchScore(internship.skills, userSkills);
    
    response += `**${index + 1}. ${internship.title}** - ${matchScore}% match\n`;
    response += `🏢 **Company:** ${internship.company}\n`;
    response += `📍 **Location:** ${internship.location}\n`;
    response += `💰 **Stipend:** ${internship.salary}\n`;
    response += `🛠️ **Key Skills:** ${internship.skills.slice(0, 3).join(', ')}\n`;
    response += `\n`;
  });

  response += `💡 **Tip:** These are sorted by relevance to your skills. Go to "Browse Internships" to see all ${matchingInternships.length} matches!`;

  return response;
};

// Calculate match score between internship skills and user skills
const calculateMatchScore = (internshipSkills, userSkills) => {
  const userSkillsLower = userSkills.map(skill => skill.toLowerCase());
  const internshipSkillsLower = internshipSkills.map(skill => skill.toLowerCase());
  
  const matchingSkills = internshipSkillsLower.filter(skill => 
    userSkillsLower.some(userSkill => skill.includes(userSkill))
  );
  
  const score = (matchingSkills.length / internshipSkillsLower.length) * 100;
  return Math.round(score);
};

// Extract skills from user message
export const extractSkillsFromMessage = (message) => {
  const skillKeywords = [
    'react', 'javascript', 'python', 'java', 'html', 'css', 'node', 'express',
    'mongodb', 'sql', 'php', 'angular', 'vue', 'typescript', 'flutter', 'react native',
    'android', 'ios', 'swift', 'kotlin', 'machine learning', 'data science', 'ai',
    'digital marketing', 'seo', 'social media', 'content writing', 'graphic design',
    'ui/ux', 'figma', 'adobe xd', 'photoshop', 'video editing', 'finance', 'accounting',
    'sales', 'business development', 'customer service', 'hr', 'recruitment'
  ];

  const foundSkills = skillKeywords.filter(skill => 
    message.toLowerCase().includes(skill)
  );

  return foundSkills;
};