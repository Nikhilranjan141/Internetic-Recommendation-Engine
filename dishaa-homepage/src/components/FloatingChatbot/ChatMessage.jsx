
// import React from 'react';
// import './ChatMessage.css';

// const ChatMessage = ({ message }) => {
//   const formatMessage = (text = "") => {
//     // Agar text undefined/null ho to empty string ban jaayega
//     return text.split('\n').map((line, i) => (
//       <p key={i}>{line}</p>
//     ));
//   };

//   if (!message) return null; // agar message hi nahi hai to kuch render mat karo

//   return (
//     <div className={`message ${message.sender || "unknown"}`}>
//       <div className="message-content">
//         {formatMessage(message.text)}
//         {message.timestamp && (
//           <span className="timestamp">
//             {new Date(message.timestamp).toLocaleTimeString([], { 
//               hour: '2-digit', 
//               minute: '2-digit' 
//             })}
//           </span>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatMessage;











import React from 'react';
import './ChatMessage.css';

const ChatMessage = ({ message }) => {
  const formatMessage = (text = "") => {
    return text.split('\n').map((line, i) => (
      <p key={i}>{line}</p>
    ));
  };

  if (!message) return null;

  return (
    <div className={`message ${message.sender || "unknown"}`}>
      <div className="message-content">
        {formatMessage(message.text)}
        {message.timestamp && (
          <span className="timestamp">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;