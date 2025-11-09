import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpDown, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Vagas', path: '/jobs' },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <ArrowUpDown className="w-7 h-7 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              GO! HIRE
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors text-muted-foreground hover:text-primary ${
                  isActive(item.path) ? 'text-primary' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="w-px h-6 bg-border"></div>
            <Link to="/login" className="font-medium text-muted-foreground hover:text-primary flex items-center gap-1">
              Entrar <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
                Cadastrar-se
              </Button>
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 space-y-4 border-t border-border"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block font-medium transition-colors py-2 ${
                  isActive(item.path)
                    ? 'text-primary'
                    : 'text-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <Link to="/login">
                <Button variant="outline" className="w-full">Entrar</Button>
              </Link>
              <Link to="/register">
                <Button className="w-full bg-primary hover:bg-primary/90">Cadastrar-se</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
};

export default Header;