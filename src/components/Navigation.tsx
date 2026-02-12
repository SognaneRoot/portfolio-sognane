import { useState } from 'react';
import { Menu, X, Settings } from 'lucide-react';
import { Button } from './ui/button';

interface NavigationProps {
  onAdminAccess?: () => void;
}

export default function Navigation({ onAdminAccess }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Accueil', href: '#accueil' },
    { name: 'CV', href: '#cv' },
    { name: 'Projets', href: '#projets' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleAdminClick = () => {
    if (onAdminAccess) {
      onAdminAccess();
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ndiaga Sognane
            </span>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md transition-colors duration-200"
                >
                  {item.name}
                </button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAdminClick}
                className="text-gray-500 hover:text-blue-600"
                title="Administration"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-border">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md w-full text-left transition-colors duration-200"
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={handleAdminClick}
                className="text-gray-500 hover:text-blue-600 block px-3 py-2 rounded-md w-full text-left transition-colors duration-200 flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Administration
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}