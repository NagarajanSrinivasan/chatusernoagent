import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
 import './chat.css';
const socket = io('http://ec2-13-201-101-4.ap-south-1.compute.amazonaws.com:5001');



function UserApp() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [requestAccepted, setRequestAccepted] = useState(false);

  useEffect(() => {
                

    socket.emit('join-user', 'user1');

    socket.on('request-accepted', (data) => {
      setRequestAccepted(true);
    });

                             
    
    socket.on('new-message', (message) => {
      setMessages((prevMessages) => { 
        if(!prevMessages.find((msg) => msg.text === message.text &&
           msg.sender === message.sender)) {
             return [...prevMessages, message];
            } 
            return prevMessages;
          });
    });
  }, []);

  const handleSendRequest = () => {
    socket.emit('send-request', {
      userId: 'user1',
      agentId: 'agent1'
    });
    setRequestSent(true);
  };

  const handleSendMessage = () => {
    socket.emit('send-message', {
      text,
      sender: 'user',
      receiver: 'agent1'
      
    });
    setMessages((prevMessages) => [
      ...prevMessages,
      { text, sender: 'user' }
    ]);
    setText('');
  };

    const endChat = () => {
    socket.emit('endChat');
  };

  return (
    <div className="chat-app">
 <header className="chat-header">
         <div className="chat-title">Live Support Chat</div>
         <div className="status-indicator">
           {/* <div className={`status-dot ${chatState.status === 'chatting' ? 'online' : 'offline'}`}></div>
           <span>
             {chatState.status === 'idle' && 'Not connected'}
            {chatState.status === 'waiting' && 'Waiting for agent...'}
             {chatState.status === 'chatting' && 'Connected with agent'}
           </span> */}
         </div>
       </header>
<main className="chat-area">  

{!requestSent && (
           <button className="request-button" onClick={handleSendRequest}>
             Request Live Chat
          </button>
        )}
         {requestSent && !requestAccepted && (
          <div className="waiting-indicator">
            <div className="spinner"></div>
           <p>Waiting for an agent to respond...</p>
          </div>
       )}

       {requestAccepted && (
          <div className="message-container">
            {messages.map((message, index) => (
              <div 
                 key={index} 
                className={`message ${message.sender === 'user' ? 'user-message' : 'agent-message'}`}
              >
                {message.text}
                {/* <span className="message-time">{message.time}</span> */}
              </div>
           ))}
          </div>
        )}
      
      
</main>
            {requestAccepted && (
        <div className="input-area">
        <input
            type="text"
            className="message-input"
            value={text}
          onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
             placeholder="Type your message..."
           />
          <button className="send-button" onClick={handleSendMessage}>
            Send
           </button>
           <button className="end-button" onClick={endChat}>
            End Chat
         </button>
        </div>
     )}




    </div>
  );
}

export default UserApp;
// import React, { useState } from 'react';
// import './chat.css';

// function UserApp({ socket, chatState, setChatState }) {
//   const [message, setMessage] = useState('');

//   const requestChat = () => {
//     socket.emit('requestChat');
//     setChatState(prev => ({ ...prev, status: 'waiting' }));
//   };

//   const sendMessage = () => {
//     if (message.trim()) {
//       const newMessage = {
//         sender: 'user',
//         text: message,
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//       };
//       socket.emit('sendMessage', newMessage);
//       setMessage('');
//     }
//   };

//   const endChat = () => {
//     socket.emit('endChat');
//   };

//   return (
//     <div className="chat-app">
//       <header className="chat-header">
//         <div className="chat-title">Live Support Chat</div>
//         <div className="status-indicator">
//           <div className={`status-dot ${chatState.status === 'chatting' ? 'online' : 'offline'}`}></div>
//           <span>
//             {chatState.status === 'idle' && 'Not connected'}
//             {chatState.status === 'waiting' && 'Waiting for agent...'}
//             {chatState.status === 'chatting' && 'Connected with agent'}
//           </span>
//         </div>
//       </header>

//       <main className="chat-area">
//         {chatState.status === 'idle' && (
//           <button className="request-button" onClick={requestChat}>
//             Request Live Chat
//           </button>
//         )}

//         {chatState.status === 'waiting' && (
//           <div className="waiting-indicator">
//             <div className="spinner"></div>
//             <p>Waiting for an agent to respond...</p>
//           </div>
//         )}

//         {chatState.status === 'chatting' && (
//           <div className="message-container">
//             {chatState.messages.map((msg, i) => (
//               <div 
//                 key={i} 
//                 className={`message ${msg.sender === 'user' ? 'user-message' : 'agent-message'}`}
//               >
//                 {msg.text}
//                 <br></br>
//                 <span className="message-time">{msg.time}</span>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>

//       {chatState.status === 'chatting' && (
//         <div className="input-area">
//           <input
//             type="text"
//             className="message-input"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//             placeholder="Type your message..."
//           />
//           <button className="send-button" onClick={sendMessage}>
//             Send
//           </button>
//           <button className="end-button" onClick={endChat}>
//             End Chat
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default UserApp;