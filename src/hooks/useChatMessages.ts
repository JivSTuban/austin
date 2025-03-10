import { useState, FormEvent, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Agent } from './useAgentData';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const useChatMessages = (
  sessionId: string,
  messages: ChatMessage[],
  setMessages: (messages: ChatMessage[]) => void,
  agent: Agent | null
) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Send initial greeting when chat starts
  useEffect(() => {
    if (messages.length === 0 && agent) {
      const formattedValue = agent.averagevaluethreeyear ? agent.averagevaluethreeyear.toLocaleString() : '0';
      const initialMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: `Hi! I'm ${agent.name} from ${agent.businessname}. With ${agent.countlastyear} transactions in the last year and an average property value of $${formattedValue}, I specialize in ${agent.specialties.join(', ')}. How can I assist you today?`
      };
      setMessages([initialMessage]);
    }
  }, [sessionId, messages.length, agent, setMessages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !agent) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: inputValue.trim()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      // In a real app, you'd make an API call here with the agent's info for context
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

      const agentMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: `I understand you're interested in ${inputValue.toLowerCase()}. Based on my experience with ${agent.countAllTime} transactions, I can help guide you through the process. What specific questions do you have?`
      };

      setMessages([...updatedMessages, agentMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // You might want to show an error toast here
    } finally {
      setIsLoading(false);
    }
  };

  return {
    inputValue,
    setInputValue,
    isLoading,
    handleSubmit,
  };
};
