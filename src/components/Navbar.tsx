import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Star, MessageSquare, Map, Calculator, Building, Coins, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProfileDropdown from './ProfileDropdown';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '../lib/supabase';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [userInitials, setUserInitials] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/maps', label: 'Maps', icon: Map },
    { path: '/investor-package', label: 'Investor Package', icon: Coins },
    { path: '/calculators', label: 'Calculators', icon: Calculator },
    { path: '/sold-properties', label: 'Sold Properties', icon: DollarSign },
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

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(' ');
      const initials = names.map((name) => name.charAt(0)).join('');
      setUserInitials(initials);
    }

    // Check if user is admin
    const checkAdminStatus = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        setIsAdmin(data?.role === 'admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  return (
    <nav 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-8 py-5',
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="text-2xl font-medium tracking-tight opacity-90 hover:opacity-100 transition-opacity duration-200"
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
                'flex items-center text-sm font-medium group',
                location.pathname === item.path 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-blue-500',
                'transition-all duration-200'
              )}
            >
              <item.icon className={cn(
                "w-4 h-4 mr-2 transition-transform duration-200",
                "group-hover:scale-110"
              )} />
              <span className="relative">
                {item.label}
                <span className={cn(
                  "absolute -bottom-1.5 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-200",
                  location.pathname === item.path ? "w-full" : "group-hover:w-full"
                )}></span>
              </span>
            </Link>
          ))}
          <div className="ml-4 pl-4 border-l border-gray-200">
            <ProfileDropdown isAdmin={isAdmin} />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu}
          className="md:hidden p-2.5 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
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
          'fixed inset-0 z-40 bg-white/95 backdrop-blur-sm flex flex-col pt-24 pb-8 px-8 md:hidden transition-all duration-300 ease-in-out',
          isOpen 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-[-8px] pointer-events-none'
        )}
      >
        <div className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center py-3.5 px-4 rounded-lg text-base font-medium',
                location.pathname === item.path 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:bg-gray-50',
                'transition-colors duration-200'
              )}
            >
              <item.icon className="w-5 h-5 mr-3.5" />
              {item.label}
            </Link>
          ))}
        </div>
        <div className="mt-auto pt-6 border-t border-gray-100 flex justify-center">
          <ProfileDropdown />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
