
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, Phone } from 'lucide-react';
import { useAgentData } from '@/hooks/useAgentData';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { agent } = useAgentData('X1-ZUtpaayyyrapzd_82rpg');

  return (
    <footer className="bg-gradient-to-b from-transparent to-gray-50/60 pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="space-y-4">
            <h3 className="text-xl font-medium">{agent?.name}</h3>
            <p className="text-gray-600 max-w-sm">
              {agent?.description || 'Helping people find their dream homes in Ohio with expertise and dedication.'}
            </p>
            <div className="flex space-x-4 pt-2">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <Link to="/forum" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Forum
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium">Contact</h3>
            <div className="space-y-2">
              <a 
                href={`mailto:${agent?.email}`} 
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                {agent?.email}
              </a>
              <a 
                href={`tel:${agent?.phonecell}`} 
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Phone className="w-4 h-4 mr-2" />
                {agent?.phonecell}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} {agent?.businessname || 'Austin McClain Properties'}. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
