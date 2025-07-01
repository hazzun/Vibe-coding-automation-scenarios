import React from 'react';
import { Home } from 'lucide-react';

const Header = () => {
  const handleHomeClick = () => {
    window.location.reload();
  };

  return (
    <header className="bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <span className="text-point font-bold text-xl sm:text-2xl w-10 sm:w-12">OK</span>
          <div className="flex items-center justify-center">
            <h1 className="text-lg sm:text-xl font-bold text-foreground">예산규정 알려DREAM</h1>
          </div>
          <button
            onClick={handleHomeClick}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors w-10 sm:w-12 flex items-center justify-center"
            aria-label="홈으로 이동"
          >
            <Home className="h-5 w-5 sm:h-6 sm:w-6 text-point" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
