import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Mic, Clock, CheckCheck } from 'lucide-react';
import { MOOD_CONFIG } from '../data/topics';

// WhatsApp-style chat message
function ChatBubble({ msg, isUser }) {
  const time = new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className={`wa-bubble-row ${isUser ? 'wa-user' : 'wa-bot'}`}>
      <div className={`wa-bubble ${isUser ? 'wa-bubble-user' : 'wa-bubble-bot'}`}>
        {!isUser && <span className="wa-sender">Hunter AI 🤖</span>}
        {msg.emotion && (
          <span className="wa-emotion-tag" style={{ color: MOOD_CONFIG[msg.emotion]?.color }}>
            {MOOD_CONFIG[msg.emotion]?.emoji} {MOOD_CONFIG[msg.emotion]?.label}
          </span>
        )}
        <p className="wa-text">{msg.text}</p>
        <span className="wa-time">
          {time}
          {isUser && <CheckCheck size={12} className="wa-read" />}
        </span>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="wa-bubble-row wa-bot">
      <div className="wa-bubble wa-bubble-bot wa-typing">
        <div className="wa-typing-dots">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}

export default function WhatsAppLesson({ topic, topicIdx, totalTopics, onAnswer, mood, aiResponse, loading }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [initialized, setInitialized] = useState(false);
  const chatEndRef = useRef(null);
  const prevTopicRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Reset on new topic
  useEffect(() => {
    if (prevTopicRef.current !== topic.id) {
      prevTopicRef.current = topic.id;
      setInitialized(false);
      setMessages([]);

      setTimeout(() => {
        setMessages([
          {
            id: 'sys-1',
            text: `📚 Topic ${topicIdx + 1}/${totalTopics}`,
            isUser: false,
            time: Date.now(),
            isSystem: true,
          },
          {
            id: 'q-1',
            text: `Hey! 👋 Let's talk about:\n\n*${topic.title}*\n\n💡 Hint: ${topic.hint}\n\nExplain it to me in your own words — type or voice note! 🎤`,
            isUser: false,
            time: Date.now() + 100,
          },
        ]);
        setInitialized(true);
      }, 300);
    }
  }, [topic, topicIdx, totalTopics]);

  // Add AI response when it comes
  useEffect(() => {
    if (aiResponse && mood) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          text: aiResponse,
          isUser: false,
          time: Date.now(),
          emotion: mood,
        },
      ]);
    }
  }, [aiResponse, mood]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = {
      id: `user-${Date.now()}`,
      text: input,
      isUser: true,
      time: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    onAnswer(input);
    setInput('');
  };

  return (
    <div className="wa-container animate-fade-in">
      {/* Header */}
      <div className="wa-header">
        <div className="wa-header-avatar">
          <Bot size={18} className="text-white" />
        </div>
        <div className="wa-header-info">
          <p className="wa-header-name">Hunter AI</p>
          <p className="wa-header-status">{loading ? 'typing...' : 'online'}</p>
        </div>
        <div className="wa-header-topic">
          <span className="text-[10px] text-hunter-accent-light bg-hunter-accent/15 px-2 py-0.5 rounded-full">
            {topicIdx + 1}/{totalTopics}
          </span>
        </div>
      </div>

      {/* Chat */}
      <div className="wa-chat-body">
        {/* Wallpaper pattern */}
        <div className="wa-wallpaper" />

        {messages.map(msg =>
          msg.isSystem ? (
            <div key={msg.id} className="wa-system-msg">
              <span>{msg.text}</span>
            </div>
          ) : (
            <ChatBubble key={msg.id} msg={msg} isUser={msg.isUser} />
          )
        )}
        {loading && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="wa-input-bar">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type your answer..."
          className="wa-input"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="wa-send-btn"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
