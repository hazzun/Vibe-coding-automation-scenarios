import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message: string;
  isLoading: boolean;
}

const LoadingOverlay = ({ message, isLoading }: LoadingOverlayProps) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-2xl flex flex-col items-center space-y-4 mx-4 max-w-sm w-full">
        <Loader2 className="h-12 w-12 text-point animate-spin" />
        <p className="text-lg font-medium text-foreground text-center">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
