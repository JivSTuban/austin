import { useEffect, useState } from 'react';
import '@n8n/chat/style.css';
import '@/lib/chat.css';
import { createChat } from '@n8n/chat';

const WEBHOOK_URL = 'https://primary-production-1218.up.railway.app/webhook/8c6b3453-58f7-4d3c-a4df-d9b210367162/chat'; // Replace with your n8n webhook URL

const Chatbot = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      createChat({
        webhookUrl: WEBHOOK_URL,
        mode: 'window',
        showWelcomeScreen: false,
        defaultLanguage: 'en',
        target: '#n8n-chat',
        initialMessages: [
          'Hi there! 👋',
          'I\'m Austin, your real estate assistant. How can I help you today?'
        ],
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

  return <div id="n8n-chat" />;
};

export default Chatbot;
