import React, { memo, useState } from 'react';

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'them',
    text: 'Hey there! How is the night sky looking over your city?',
    time: '11:42 PM',
  },
  {
    id: 2,
    sender: 'me',
    text: 'It looks absolutely stunning! The moon and stars are twinkling brightly.',
    time: '11:43 PM',
  },
  {
    id: 3,
    sender: 'them',
    text: 'That sounds magical! Enjoy the peaceful night view.',
    time: '11:44 PM',
  },
];

function ChatUI() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputMsg, setInputMsg] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    const text = inputMsg.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'me',
        text,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
    setInputMsg('');
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 5,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 16px',
          background: 'rgba(24,26,32,0.55)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          borderBottom: '0.5px solid rgba(255,255,255,0.08)',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#6C5CE7',
            color: '#EEEDFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: 13,
            flexShrink: 0,
          }}
        >
          LS
        </div>
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: '#E8E9ED',
              lineHeight: 1.2,
            }}
          >
            Luna Sky
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              marginTop: 2,
              fontSize: 12,
              color: '#4ADE80',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#4ADE80',
                flexShrink: 0,
              }}
            />
            Online
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 65,
          left: 0,
          right: 0,
          bottom: 55,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          padding: '16px',
        }}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              display: 'flex',
              justifyContent: m.sender === 'me' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '75%',
                padding: '10px 14px',
                fontSize: 14,
                lineHeight: 1.45,
                ...(m.sender === 'me'
                  ? {
                      background: '#6C5CE7',
                      color: '#F4F3FF',
                      borderRadius: '14px 14px 4px 14px',
                    }
                  : {
                      background: 'rgba(30,33,40,0.85)',
                      color: '#E8E9ED',
                      borderRadius: '14px 14px 14px 4px',
                    }),
              }}
            >
              <div>{m.text}</div>
              <div
                style={{
                  marginTop: 3,
                  fontSize: 11,
                  color: '#9BA1AC',
                  textAlign: m.sender === 'me' ? 'right' : 'left',
                }}
              >
                {m.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSend}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 16px',
          background: 'rgba(24,26,32,0.6)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          borderTop: '0.5px solid rgba(255,255,255,0.08)',
        }}
      >
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
          style={{
            flex: 1,
            background: 'rgba(30,33,40,0.7)',
            border: 'none',
            outline: 'none',
            borderRadius: 20,
            padding: '9px 16px',
            fontSize: 14,
            color: '#E8E9ED',
          }}
        />
        <button
          type="submit"
          title="Send message"
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: '#6C5CE7',
            color: '#F4F3FF',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default memo(ChatUI);
