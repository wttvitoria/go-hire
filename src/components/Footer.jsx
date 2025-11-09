import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpDown } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background text-muted-foreground py-8 px-4 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <ArrowUpDown className="w-7 h-7 text-primary" />
              <span className="text-lg font-bold text-foreground">
                GO! HIRE
              </span>
            </Link>
            <p className="text-sm hidden sm:block">
              &copy; 2025 GO! HIRE. Todos os direitos reservados.
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link to="/architecture" className="hover:text-primary transition-colors">Arquitetura</Link>
            <Link to="#" className="hover:text-primary transition-colors">Termos</Link>
            <Link to="#" className="hover:text-primary transition-colors">Privacidade</Link>
          </div>
          <p className="text-sm sm:hidden">
            &copy; 2025 GO! HIRE. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;