import { useEffect, useState, useRef } from 'react';
import '@n8n/chat/style.css';
import '@/lib/chat.css';
import { createChat } from '@n8n/chat';

const WEBHOOK_URL = 'https://primary-production-1218.up.railway.app/webhook/8c6b3453-58f7-4d3c-a4df-d9b210367162/chat'; // Replace with your n8n webhook URL

// Define a type for the chat instance with the methods we need
type ChatInstance = {
  sendMessage: (message: string) => void;
};

const Chatbot = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Use a ref to store the chat instance
  const chatRef = useRef<ChatInstance | null>(null);

  const conversationStarters = [
    "What properties are available in Austin?",
    "Tell me about home prices in North Austin",
    "How's the real estate market right now?",
    "I'm looking to sell my home"
  ];

  const handleStarterClick = (message: string) => {
    if (chatRef.current) {
      chatRef.current.sendMessage(message);
    }
  };

  useEffect(() => {
    try {
      const chat = createChat({
        webhookUrl: WEBHOOK_URL,
        mode: 'window',
        showWelcomeScreen: false,
        defaultLanguage: 'en',
        target: '#n8n-chat',
        initialMessages: [
          'Hi there! 👋',
          'I\'m Austin, your real estate assistant. How can I help you today?'
        ],
        i18n: {
          en: {
            title: '💬  Chat with Austin McClain',
            subtitle: '', // Remove default subtitle
            footer: '',
            getStarted: 'Start Exploring'
          },
        },
        metadata: {
          source: 'website',
          theme: 'light'
        },
        onError: (error) => {
          console.error('Chat error:', error);
          setError('Failed to connect to chat service');
          setIsLoading(false);
        },
        onLoad: () => {
          setIsLoading(false);
          setError(null);
        },
      });
      
      // Use a double type assertion to safely assign the chat instance
      // First convert to unknown, then to our ChatInstance type
      chatRef.current = chat as unknown as ChatInstance;
    } catch (err) {
      console.error('Failed to initialize chat:', err);
      setError('Failed to initialize chat');
      setIsLoading(false);
    }
  }, []);

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 p-4 bg-red-50 text-red-600 rounded-lg shadow-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div id="n8n-chat" />
      {!isLoading && (
        <div className="conversation-starters">
          <p className="starters-title">Try asking about:</p>
          <div className="starters-buttons">
            {conversationStarters.map((starter, index) => (
              <button 
                key={index} 
                className="starter-button"
                onClick={() => handleStarterClick(starter)}
              >
                {starter}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
