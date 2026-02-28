import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(onComplete, 500);
          }, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-trust via-trust-dark to-trust-light transition-opacity duration-500 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center px-4">
        <div className="mb-8 animate-scaleIn">
          <div className="w-24 h-24 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-2xl">
            <div className="text-4xl font-bold text-trust">भा</div>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-2 font-heading animate-fadeIn">
          Bharat Samuh Anudan
        </h1>
        <p className="text-white/80 mb-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          भारत समूह अनुदान
        </p>
        
        <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mx-auto">
          <div
            className="h-full bg-saffron rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-white/60 text-sm mt-4">{progress}%</p>
      </div>
    </div>
  );
}