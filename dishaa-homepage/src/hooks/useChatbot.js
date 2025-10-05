// src/hooks/useChatbot.js
// import { useState, useCallback, useContext } from 'react';
// import { UserContext } from '../context/UserContext';
// import { getBotResponse, extractSkillsFromMessage } from '../data/chatbotData';

// export const useChatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const { user } = useContext(UserContext);

//   // Get user skills from profile
//   const getUserSkills = useCallback(() => {
//     try {
//       const profileData = localStorage.getItem('profileData');
//       if (profileData) {
//         const parsed = JSON.parse(profileData);
//         return parsed.skills || [];
//       }
//     } catch (error) {
//       console.error('Error getting user skills:', error);
//     }
//     return [];
//   }, []);

//   const toggleChat = useCallback(() => {
//     setIsOpen(prev => !prev);
//   }, []);

//   const handleInputChange = useCallback((e) => {
//     setInputMessage(e.target.value);
//   }, []);

//   const addMessage = useCallback((text, sender) => {
//     const newMessage = {
//       text,
//       sender,
//       timestamp: new Date()
//     };
//     setMessages(prev => [...prev, newMessage]);
//   }, []);

//   const handleSendMessage = useCallback(async () => {
//     if (!inputMessage.trim() || isLoading) return;

//     const userMessage = inputMessage.trim();
//     setInputMessage('');
//     addMessage(userMessage, 'user');
    
//     setIsLoading(true);

//     // Get user skills for personalized responses
//     const userSkills = getUserSkills();
    
//     // Extract skills from user message
//     const mentionedSkills = extractSkillsFromMessage(userMessage);
//     const allSkills = [...new Set([...userSkills, ...mentionedSkills])];

//     setTimeout(() => {
//       const botResponse = getBotResponse(userMessage, allSkills);
//       addMessage(botResponse, 'bot');
//       setIsLoading(false);
//     }, 1000 + Math.random() * 1000);
//   }, [inputMessage, isLoading, addMessage, getUserSkills]);

//   const handleQuickAction = useCallback((query) => {
//     setInputMessage(query);
//     setTimeout(() => {
//       handleSendMessage();
//     }, 300);
//   }, [handleSendMessage]);

//   // Skill-specific quick actions
//   const skillQuickActions = [
//     {
//       title: "Recommend by Skills",
//       query: "Recommend internships matching my skills",
//       icon: "🎯"
//     },
//     {
//       title: "Add My Skills",
//       query: "I want to add my skills for better recommendations",
//       icon: "🛠️"
//     },
//     {
//       title: "Top Skills Demand",
//       query: "What skills are most in demand for internships?",
//       icon: "📊"
//     }
//   ];

//   return {
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
//   };
// };









import { useState, useEffect } from 'react';

// Mock data for internships
const mockInternships = [
  {
    id: 1,
    title: "Frontend Developer Internship",
    skills: ["React", "JavaScript", "HTML"],
    description: "Work on cutting-edge React projects",
  },
  {
    id: 2,
    title: "Backend Developer Internship",
    skills: ["Node.js", "JavaScript"],
    description: "Build APIs with Node.js",
  },
  {
    id: 3,
    title: "Full Stack Internship",
    skills: ["React", "Node.js", "JavaScript"],
    description: "Work on both frontend and backend",
  },
  {
    id: 4,
    title: "UI/UX Designer Internship",
    skills: ["HTML", "CSS", "Figma"],
    description: "Design user-friendly interfaces",
  },
];

// Quick Actions responses
const quickActionResponses = {
  "how do i apply for an internship": "To apply for an internship, visit the PM Internship Scheme portal, log in with your credentials, and submit your application with updated skills and resume.",
  "how to check my application status": "You can check your application status by logging into the PM Internship Scheme portal and navigating to the 'My Applications' section.",
  "how to update my profile information": "Go to your profile page on the PM Internship Scheme portal, click 'Edit Profile', and update your details like skills, education, and contact info.",
  "what are the benefits of pm internship scheme": "The PM Internship Scheme offers benefits like monthly stipends, hands-on industry experience, skill development opportunities, and a chance to work with top companies in India.",
  "what skills should i learn for better internships": "Learning skills like Python, Machine Learning, Cloud Computing, or UI/UX design can boost your chances for top internships.",
  "i want to update my skills in profile": "Please visit your profile page on the PM Internship Scheme portal to add or update your skills."
};

const useChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userSkills, setUserSkills] = useState([]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleInputChange = (e) => setInputMessage(e.target.value);

  const getUserSkills = () => userSkills;

  // Function to parse skills from user input
  const parseSkills = (text) => {
    const skillRegex = /I have ([\w\s,]+) skills/i;
    const match = text.match(skillRegex);
    if (match) {
      return match[1].split(',').map(skill => skill.trim().toLowerCase());
    }
    return [];
  };

  // Function to filter internships based on skills
  const filterInternshipsBySkills = (skills) => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000); // Fake delay to mimic API call

    return mockInternships.filter(internship =>
      skills.some(skill => 
        internship.skills.map(s => s.toLowerCase()).includes(skill)
      )
    );
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const userMessage = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Normalize input for matching
    const normalizedInput = inputMessage.trim().toLowerCase().replace(/[?]/g, '');
    console.log('Normalized input:', normalizedInput); // Debugging

    // Check if input matches a Quick Action query
    const quickActionResponse = Object.keys(quickActionResponses).find(query => 
      normalizedInput.includes(query.toLowerCase())
    );

    if (quickActionResponse) {
      console.log('Matched Quick Action:', quickActionResponse); // Debugging
      const botMessage = {
        text: quickActionResponses[quickActionResponse],
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, botMessage]);
    } else {
      // Check if user mentioned skills
      const skills = parseSkills(inputMessage);
      if (skills.length > 0) {
        setUserSkills(skills);
        const internships = filterInternshipsBySkills(skills);

        let botResponseText;
        if (internships.length > 0) {
          botResponseText = `Found ${internships.length} internship(s) matching your skills (${skills.join(', ')}):\n`;
          internships.forEach((internship, index) => {
            botResponseText += `${index + 1}. ${internship.title} - Required Skills: ${internship.skills.join(', ')}\n`;
          });
        } else {
          botResponseText = `Sorry, no internships found matching your skills (${skills.join(', ')}). Try adding more skills or check other opportunities!`;
        }

        const botMessage = {
          text: botResponseText,
          sender: 'bot',
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Default response
        const botMessage = {
          text: "Please tell me your skills (e.g., 'I have React, JavaScript, HTML skills') or ask about the PM Internship Scheme (e.g., 'What are the benefits of PM Internship Scheme?')!",
          sender: 'bot',
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, botMessage]);
      }
    }

    setInputMessage('');
  };

  const handleQuickAction = async (query) => {
    const userMessage = {
      text: query,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    if (query.includes('matching my current skills') && userSkills.length > 0) {
      const internships = filterInternshipsBySkills(userSkills);
      let botResponseText;
      if (internships.length > 0) {
        botResponseText = `Found ${internships.length} internship(s) matching your skills (${userSkills.join(', ')}):\n`;
        internships.forEach((internship, index) => {
          botResponseText += `${index + 1}. ${internship.title} - Required Skills: ${internship.skills.join(', ')}\n`;
        });
      } else {
        botResponseText = `No internships found for your skills (${userSkills.join(', ')}).`;
      }

      const botMessage = {
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, botMessage]);
    } else if (quickActionResponses[query.toLowerCase()]) {
      const botMessage = {
        text: quickActionResponses[query.toLowerCase()],
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, botMessage]);
    } else {
      const botMessage = {
        text: "Processing your request... (Add logic for other quick actions)",
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, botMessage]);
    }
  };

  return {
    isOpen,
    messages,
    inputMessage,
    isLoading,
    toggleChat,
    handleSendMessage,
    handleInputChange,
    handleQuickAction,
    getUserSkills,
    skillQuickActions: [] // Added to fix FloatingChatbot.jsx error
  };
};

export default useChatbot;