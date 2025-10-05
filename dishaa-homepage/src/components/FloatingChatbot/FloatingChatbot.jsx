// src/components/FloatingChatbot/FloatingChatbot.jsx
// import React, { useState, useRef, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { useChatbot } from '../../hooks/useChatbot';
// import ChatMessage from './ChatMessage';
// import QuickActions from './QuickActions';
// import SkillQuickActions from './SkillQuickActions'; // New component
// import './FloatingChatbot.css';

// const FloatingChatbot = ({ excludePages = [] }) => {
//   const location = useLocation();
//   const messagesEndRef = useRef(null);
  
//   const {
//     isOpen,
//     messages,
//     inputMessage,
//     isLoading,
//     toggleChat,
//     handleSendMessage,
//     handleInputChange,
//     handleQuickAction,
//     skillQuickActions,
//     getUserSkills
//   } = useChatbot();

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Show skill suggestions if no skills detected
//   const userSkills = getUserSkills();
//   const shouldShowSkillPrompt = userSkills.length === 0 && messages.length === 0;

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const shouldHideChatbot = excludePages.includes(location.pathname);
//   if (shouldHideChatbot) return null;

//   return (
//     <div className="chatbot-container">
//       {/* Floating Chat Button */}
//       {!isOpen && (
//         <button className="chatbot-floating-btn" onClick={toggleChat}>
//           <span className="chat-icon">💬</span>
//           <span className="pulse-dot"></span>
//         </button>
//       )}

//       {/* Chat Window */}
//       {isOpen && (
//         <div className="chatbot-window">
//           {/* Header */}
//           <div className="chatbot-header">
//             <div className="chatbot-avatar">
//               <span>🤖</span>
//             </div>
//             <div className="chatbot-info">
//               <h3>DISHAA Assistant</h3>
//               <span className="status">
//                 {userSkills.length > 0 ? `Skills: ${userSkills.length}` : 'Online'}
//               </span>
//             </div>
//             <button className="close-btn" onClick={toggleChat}>×</button>
//           </div>

//           {/* Messages Area */}
//           <div className="chatbot-messages">
//             {messages.length === 0 ? (
//               <div className="welcome-section">
//                 <div className="welcome-message">
//                   <p>Hello! I'm your DISHAA AI assistant. 👋</p>
//                   <p>I can recommend internships based on your skills!</p>
                  
//                   {shouldShowSkillPrompt && (
//                     <div className="skill-prompt">
//                       <p>🎯 <strong>Pro Tip:</strong> Add your skills to get personalized internship recommendations!</p>
//                     </div>
//                   )}
//                 </div>
                
//                 {/* Skill-based Quick Actions */}
//                 <SkillQuickActions 
//                   onActionClick={handleQuickAction}
//                   userSkills={userSkills}
//                 />
                
//                 {/* Regular Quick Actions */}
//                 <QuickActions onActionClick={handleQuickAction} />
//               </div>
//             ) : (
//               messages.map((message, index) => (
//                 <ChatMessage key={index} message={message} />
//               ))
//             )}
            
//             {isLoading && (
//               <div className="message bot typing-indicator">
//                 <div className="typing-dots">
//                   <span></span>
//                   <span></span>
//                   <span></span>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input Area */}
//           <div className="chatbot-input">
//             <div className="input-container">
//               <input
//                 type="text"
//                 placeholder="Ask about internships or skills..."
//                 value={inputMessage}
//                 onChange={handleInputChange}
//                 onKeyPress={handleKeyPress}
//                 disabled={isLoading}
//               />
//               <button 
//                 onClick={handleSendMessage}
//                 disabled={isLoading || !inputMessage.trim()}
//                 className="send-btn"
//               >
//                 {isLoading ? '⏳' : '📤'}
//               </button>
//             </div>
//             <div className="suggestions">
//               <small>Try: "Recommend internships for React" or "My skills are Python, ML"</small>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FloatingChatbot;
















import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useChatbot from '../../hooks/useChatbot';
import ChatMessage from './ChatMessage';
import QuickActions from './QuickActions';
import SkillQuickActions from './SkillQuickActions';
import './FloatingChatbot.css';

const FloatingChatbot = ({ excludePages = [] }) => {
  const location = useLocation();
  const messagesEndRef = useRef(null);
  
  const {
    isOpen,
    messages,
    inputMessage,
    isLoading,
    toggleChat,
    handleSendMessage,
    handleInputChange,
    handleQuickAction,
    getUserSkills
  } = useChatbot();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const userSkills = getUserSkills();
  const shouldShowSkillPrompt = userSkills.length === 0 && messages.length === 0;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const shouldHideChatbot = excludePages.includes(location.pathname);
  if (shouldHideChatbot) return null;

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button className="chatbot-floating-btn" onClick={toggleChat}>
          <span className="chat-icon">💬</span>
          <span className="pulse-dot"></span>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-avatar">
              <span>🤖</span>
            </div>
            <div className="chatbot-info">
              <h3>DISHAA Assistant</h3>
              <span className="status">
                {userSkills.length > 0 ? `Skills: ${userSkills.length}` : 'Online'}
              </span>
            </div>
            <button className="close-btn" onClick={toggleChat}>×</button>
          </div>

          <div className="chatbot-messages">
            {messages.length === 0 ? (
              <div className="welcome-section">
                <div className="welcome-message">
                  <p>Hello! I'm your DISHAA AI assistant. 👋</p>
                  <p>I can recommend internships based on your skills!</p>
                  
                  {shouldShowSkillPrompt && (
                    <div className="skill-prompt">
                      <p>🎯 <strong>Pro Tip:</strong> Add your skills to get personalized internship recommendations!</p>
                    </div>
                  )}
                </div>
                
                <SkillQuickActions 
                  onActionClick={handleQuickAction}
                  userSkills={userSkills}
                />
                
                <QuickActions onActionClick={handleQuickAction} />
              </div>
            ) : (
              messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))
            )}
            
            {isLoading && (
              <div className="message bot typing-indicator">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <div className="input-container">
              <input
                type="text"
                placeholder="Ask about internships or skills..."
                value={inputMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="send-btn"
              >
                {isLoading ? '⏳' : '📤'}
              </button>
            </div>
            <div className="suggestions">
              <small>Try: "Recommend internships for React" or "My skills are Python, ML"</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingChatbot;