
import React from 'react';
import { Bot, Building2 } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-point" />
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl font-bold text-foreground">OK 예산전결 알려DREAM</h1>
              <span className="text-xs sm:text-sm text-muted-foreground">예산규정 AI 상담</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-point" />
            <span className="text-xs sm:text-sm font-medium text-foreground">AI 도우미</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
