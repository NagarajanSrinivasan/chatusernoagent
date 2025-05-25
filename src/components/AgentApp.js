import React, { useState, useEffect } from 'react';
import './chat.css';
import io from 'socket.io-client';
const socket = io('https://wflivechatserver.netlify.app/');

function AgentApp() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [requestReceived, setRequestReceived] = useState(false);
  const [requestAccepted, setRequestAccepted] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
                 
   
    socket.emit('join-agent', 'agent1');

  
    socket.on('new-request', (data) => {
      setRequestReceived(true);
      setUserId(data.userId);
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

  const handleAcceptRequest = () => {
    socket.emit('accept-request', {
      userId: userId,
      agentId: 'agent1'
    });
    setRequestAccepted(true);
  };

    const declineChat = () => {
     setRequestAccepted(false);
  };

  const handleSendMessage = () => {
    socket.emit('send-message', {
      text,
      sender: 'agent',
      receiver: userId
    });
    setMessages((prevMessages) => [
      ...prevMessages,
      { text, sender: 'agent' }
    ]);
    setText('');
  };
     const endChat = () => {
    socket.emit('endChat');
  };

  return (
    <div className="chat-app">
      <header className="chat-header">
        <div className="chat-title">Agent Console</div>
        <div className="status-indicator">
          {/* <div className={`status-dot ${chatState.status === 'chatting' ? 'online' : 'offline'}`}></div>
          <span>
            {chatState.status === 'idle' && 'Waiting for requests'}
            {chatState.status === 'waiting' && 'Chat request received'}
            {chatState.status === 'chatting' && 'In conversation'}
          </span> */}
        </div>
      </header>

      <main className="chat-area">
        {!requestReceived && (
          <div className="waiting-indicator">
            <p>You're currently online and will be notified when a user requests chat.</p>
          </div>
        )}

        {requestAccepted && (
          <div className="message-container">
           {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.sender === 'agent' ? 'user-message' : 'agent-message'}`}
              >
                {message.text}
                <span className="message-time">{message.time}</span>
              </div>
            ))}
          </div>
        )}
      </main>

      {requestAccepted &&  (
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

      {requestReceived && !requestAccepted && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-title">New Chat Request</div>
            <p>A user is requesting to chat with you.</p>
            <div className="modal-buttons">
              <button className="modal-button decline" onClick={declineChat}>
                Decline
              </button>
              <button className="modal-button accept" onClick={handleAcceptRequest}>
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgentApp;

// function AgentApp({ socket, chatState, setChatState }) {
//   const [message, setMessage] = useState('');

//   const acceptChat = () => {
//     socket.emit('acceptChat', socket.id);
//   };

//   const declineChat = () => {
//     setChatState(prev => ({ ...prev, showRequest: false }));
//   };

//   const sendMessage = () => {
//     if (message.trim()) {
//       const newMessage = {
//         sender: 'agent',
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
//         <div className="chat-title">Agent Console</div>
//         <div className="status-indicator">
//           <div className={`status-dot ${chatState.status === 'chatting' ? 'online' : 'offline'}`}></div>
//           <span>
//             {chatState.status === 'idle' && 'Waiting for requests'}
//             {chatState.status === 'waiting' && 'Chat request received'}
//             {chatState.status === 'chatting' && 'In conversation'}
//           </span>
//         </div>
//       </header>

//       <main className="chat-area">
//         {chatState.status === 'idle' && (
//           <div className="waiting-indicator">
//             <p>You're currently online and will be notified when a user requests chat.</p>
//           </div>
//         )}

//         {chatState.status === 'chatting' && (
//           <div className="message-container">
//             {chatState.messages.map((msg, i) => (
//               <div 
//                 key={i} 
//                 className={`message ${msg.sender === 'agent' ? 'user-message' : 'agent-message'}`}
//               >
//                 {msg.text}
//                  <br></br>
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

//       {chatState.showRequest && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-title">New Chat Request</div>
//             <p>A user is requesting to chat with you.</p>
//             <div className="modal-buttons">
//               <button className="modal-button decline" onClick={declineChat}>
//                 Decline
//               </button>
//               <button className="modal-button accept" onClick={acceptChat}>
//                 Accept
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AgentApp;
