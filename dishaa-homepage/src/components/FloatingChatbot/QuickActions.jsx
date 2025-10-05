
// import React from 'react';
// import './QuickActions.css';

// const QuickActions = ({ onActionClick }) => {
//   const quickActions = [
//     {
//       title: "Apply for Internship",
//       query: "How do I apply for an internship?",
//       icon: "📝"
//     },
//     {
//       title: "Check Status",
//       query: "How to check my application status?",
//       icon: "📊"
//     },
//     {
//       title: "Update Profile",
//       query: "How to update my profile information?",
//       icon: "👤"
//     },
//     {
//       title: "Scheme Benefits",
//       query: "What are the benefits of PM Internship Scheme?",
//       icon: "🎯"
//     }
//   ];

//   return (
//     <div className="quick-actions">
//       <h4>Quick Help</h4>
//       <div className="actions-grid">
//         {quickActions.map((action, index) => (
//           <button
//             key={index}
//             className="action-btn"
//             onClick={() => onActionClick(action.query)}
//           >
//             <span className="action-icon">{action.icon}</span>
//             <span className="action-text">{action.title}</span>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default QuickActions;

















import React from 'react';
import './QuickActions.css';

const QuickActions = ({ onActionClick }) => {
  const quickActions = [
    {
      title: "Apply for Internship",
      query: "How do I apply for an internship?",
      icon: "📝"
    },
    {
      title: "Check Status",
      query: "How to check my application status?",
      icon: "📊"
    },
    {
      title: "Update Profile",
      query: "How to update my profile information?",
      icon: "👤"
    },
    {
      title: "Scheme Benefits",
      query: "What are the benefits of PM Internship Scheme?",
      icon: "🎯"
    }
  ];

  return (
    <div className="quick-actions">
      <h4>Quick Help</h4>
      <div className="actions-grid">
        {quickActions.map((action, index) => (
          <button
            key={index}
            className="action-btn"
            onClick={() => onActionClick(action.query)}
          >
            <span className="action-icon">{action.icon}</span>
            <span className="action-text">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;