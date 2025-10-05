// src/components/FloatingChatbot/SkillQuickActions.jsx
// import React from 'react';
// import './SkillQuickActions.css';

// const SkillQuickActions = ({ onActionClick, userSkills }) => {
//   const skillActions = [
//     {
//       title: "Recommend by My Skills",
//       query: "Recommend internships matching my current skills",
//       icon: "🎯",
//       description: "Based on your profile skills"
//     },
//     {
//       title: "Tell My Skills",
//       query: "I know React, JavaScript, and Node.js",
//       icon: "💬",
//       description: "Describe your skills for instant matches"
//     },
//     {
//       title: "Skill Suggestions",
//       query: "What skills should I learn for better internships?",
//       icon: "📚",
//       description: "Get skill development advice"
//     },
//     {
//       title: "Update Skills",
//       query: "I want to update my skills in profile",
//       icon: "⚡",
//       description: "Go to profile to add skills"
//     }
//   ];

//   return (
//     <div className="skill-quick-actions">
//       <h4>🎯 Skill-Based Recommendations</h4>
//       <div className="skill-actions-grid">
//         {skillActions.map((action, index) => (
//           <button
//             key={index}
//             className="skill-action-btn"
//             onClick={() => onActionClick(action.query)}
//           >
//             <span className="skill-action-icon">{action.icon}</span>
//             <span className="skill-action-title">{action.title}</span>
//             <span className="skill-action-desc">{action.description}</span>
//           </button>
//         ))}
//       </div>
      
//       {userSkills.length > 0 && (
//         <div className="current-skills">
//           <p>✅ I see your skills: <strong>{userSkills.join(', ')}</strong></p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SkillQuickActions;


















import React from 'react';
import './SkillQuickActions.css';

const SkillQuickActions = ({ onActionClick, userSkills }) => {
  const skillActions = [
    {
      title: "Recommend by My Skills",
      query: "Recommend internships matching my current skills",
      icon: "🎯",
      description: "Based on your profile skills"
    },
    {
      title: "Tell My Skills",
      query: "I know React, JavaScript, and Node.js",
      icon: "💬",
      description: "Describe your skills for instant matches"
    },
    {
      title: "Skill Suggestions",
      query: "What skills should I learn for better internships?",
      icon: "📚",
      description: "Get skill development advice"
    },
    {
      title: "Update Skills",
      query: "I want to update my skills in profile",
      icon: "⚡",
      description: "Go to profile to add skills"
    }
  ];

  return (
    <div className="skill-quick-actions">
      <h4>🎯 Skill-Based Recommendations</h4>
      <div className="skill-actions-grid">
        {skillActions.map((action, index) => (
          <button
            key={index}
            className="skill-action-btn"
            onClick={() => onActionClick(action.query)}
          >
            <span className="skill-action-icon">{action.icon}</span>
            <span className="skill-action-title">{action.title}</span>
            <span className="skill-action-desc">{action.description}</span>
          </button>
        ))}
      </div>
      
      {userSkills.length > 0 && (
        <div className="current-skills">
          <p>✅ I see your skills: <strong>{userSkills.join(', ')}</strong></p>
        </div>
      )}
    </div>
  );
};

export default SkillQuickActions;