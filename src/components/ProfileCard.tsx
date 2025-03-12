import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/ProfileCard.css';

interface ProfileCardProps {
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  imageUrl?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  title = 'Real Estate Agent',
  email = 'contact@example.com',
  phone = '(512) 555-0123',
  imageUrl,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get initials for the card (max 2 characters)
  const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return name.substring(0, 2);
  };

  const initials = getInitials(name);

  return (
    <div 
      className="profile-card-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`profile-card ${isHovered ? 'flipped' : ''}`}>
        <div className="profile-card-front">
        <video
            src="/backCard.mp4"
            className="absolute inset-0 w-full h-full object-contain dark:brightness-[0.2] dark:grayscale"
            autoPlay
            playsInline
            muted
            onTimeUpdate={(e) => {
              const video = e.target as HTMLVideoElement;
              if (video.currentTime >= 3) {
                video.pause();
              }
            }}
          />
        </div>
        <div className="profile-card-back">
         
           <video
               src="/frontCard.mp4"
                className="absolute inset-0 w-full h-full object-contain dark:brightness-[0.2] dark:grayscale"
                autoPlay
                playsInline
                muted
                onTimeUpdate={(e) => {
                  const video = e.target as HTMLVideoElement;
                  if (video.currentTime >= 3) {
                    video.pause();
                  }
                }}
              />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;