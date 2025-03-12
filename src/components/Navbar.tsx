import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Star, MessageSquare, Map, Calculator, Building, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/maps', label: 'Maps', icon: Map },
    { path: '/investor-package', label: 'Investor Package', icon: Coins },
    { path: '/calculators', label: 'Calculators', icon: Calculator },
    { path: '/home-estimate', label: 'Estimate', icon: Building },
    { path: '/reviews', label: 'Reviews', icon: Star },
    { path: '/forum', label: 'Forum', icon: MessageSquare },
    
  ];

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when path changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-350 px-6 py-4',
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="text-xl font-medium tracking-tight opacity-90 hover:opacity-100"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Austin McClain
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center text-sm font-medium opacity-80 hover:opacity-100',
                location.pathname === item.path ? 'text-blue-600 opacity-100' : 'text-gray-600',
                'transition-colors duration-250'
              )}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-md focus:outline-none"
          aria-expanded={isOpen}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="w-5 h-5 text-gray-800" />
          ) : (
            <Menu className="w-5 h-5 text-gray-800" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          'fixed inset-0 z-40 bg-white flex flex-col pt-20 pb-6 px-6 md:hidden transition-transform duration-350 ease-in-out transform',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center py-4 text-lg font-medium',
              location.pathname === item.path ? 'text-blue-600' : 'text-gray-700',
              'border-b border-gray-100 transition-colors duration-150'
            )}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
