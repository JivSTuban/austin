import { useEffect, useState } from 'react';
import { Award, Home, MessageCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useImageLoad } from '@/lib/animations';
import { useAgentData } from '@/hooks/useAgentData';
import { Loading } from '@/components/LoadingStates';
import siAustinImage from '../../public/siAustin.png';

const ProfileCard = () => {
  const { imageStyle, onLoad } = useImageLoad();
  const [animate, setAnimate] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [showChat, setShowChat] = useState(false);
  const { agent, isLoading, error } = useAgentData('X1-ZUtpaayyyrapzd_82rpg');

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 5;
    const rotateX = ((centerY - y) / centerY) * 5;
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const toggleChat = () => {
    setShowChat(!showChat);
    // Find the chat element and toggle its visibility
    const chatElement = document.getElementById('n8n-chat');
    if (chatElement) {
      const chatWindow = chatElement.querySelector('.chat-window');
      if (chatWindow) {
        if (chatWindow.classList.contains('hidden')) {
          chatWindow.classList.remove('hidden');
        } else {
          chatWindow.classList.add('hidden');
        }
      } else {
        // If the chat window isn't found, click the toggle button if it exists
        const toggleButton = chatElement.querySelector('.chat-toggle');
        if (toggleButton) {
          (toggleButton as HTMLElement).click();
        }
      }
    }
  };

  if (isLoading || !agent) {
    return <Loading />;
  }

  if (error) {
    return <p>Error loading agent data: {error}</p>;
  }

  const stats = [
    {
      icon: Home,
      value: agent.countalltime,
      label: 'Properties Sold',
      delay: 200,
    },
    {
      icon: Users,
      value: agent.ratingscount,
      label: 'Satisfied Clients',
      delay: 300,
    },
    {
      icon: Award,
      value: 3,
      label: 'Years Experience',
      delay: 400,
    },
  ];

  return (
    <div
      className="card-3d glass rounded-xl overflow-hidden relative max-w-3xl mx-auto"
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: 'transform 0.2s ease-out',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="lg:flex">
        <div className="lg:w-1/3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-300/30 to-indigo-400/30 lg:hidden" />
          <img
            src={siAustinImage}
            alt={agent.name}
            className={cn(
              'w-full h-full object-cover lg:absolute lg:inset-0',
              'transition-all duration-700'
            )}
            style={imageStyle}
            onLoad={onLoad}
          />
        </div>
        <div className="lg:w-2/3 p-6 lg:p-8 flex flex-col justify-between relative z-10">
          <div>
            <div className="flex justify-between items-start">
              <h2
                className={cn(
                  'text-2xl font-semibold mb-1',
                  animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                  'transition-all duration-500 delay-100'
                )}
              >
                {agent.name} <img src="https://static1.squarespace.com/static/5fcee1780cd30a4efbe3d2a8/t/5fd7ea3909e8b172b0d72c6a/1740643969440/" alt="reafco logo" className="h-6 w-auto ml-2 inline-block mb-2" />
              </h2>
              {/* <button
                onClick={toggleChat}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors',
                  animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                  'transition-all duration-500 delay-150'
                )}
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat with me</span>
              </button> */}
            </div>
            <p
              className={cn(
                'text-gray-600 mb-6 max-w-lg',
                animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                'transition-all duration-500 delay-200'
              )}
            >
              {agent.description}
            </p>
          </div>
          <div
            className={cn(
              'grid grid-cols-1 md:grid-cols-3 gap-4',
              animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
              'transition-all duration-500 delay-250'
            )}
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className={cn(
                  'flex flex-col items-center p-3 rounded-lg bg-white/90 shadow-sm',
                  animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                  `transition-all duration-500 delay-[${stat.delay}ms]`
                )}
              >
                <stat.icon className="w-6 h-6 text-blue-500 mb-2" />
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-gray-600 text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
