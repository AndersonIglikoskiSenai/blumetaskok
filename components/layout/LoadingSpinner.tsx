import React from 'react';
import { Loader2 } from 'lucide-react'; // Using lucide-react icon

const LoadingSpinner: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => {
  return (
    <div className={`flex justify-center items-center w-full h-full ${className}`}>
      <Loader2 className="animate-spin text-indigo-600" size={size} />
    </div>
  );
};

export default LoadingSpinner;