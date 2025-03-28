import React, { useEffect } from 'react';
import { XCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const icons = {
  success: <CheckCircle className="text-green-600 w-5 h-5" />,
  error: <XCircle className="text-red-600 w-5 h-5" />,
  info: <Info className="text-blue-600 w-5 h-5" />,
  warning: <AlertTriangle className="text-yellow-600 w-5 h-5" />,
};

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Auto-dismiss after 4s
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border 
      bg-white animate-slide-in 
      ${type === 'success' ? 'border-green-300' : ''}
      ${type === 'error' ? 'border-red-300' : ''}
      ${type === 'info' ? 'border-blue-300' : ''}
      ${type === 'warning' ? 'border-yellow-300' : ''}
    `}>
      {icons[type]}
      <span className="text-sm text-gray-800">{message}</span>
    </div>
  );
};

export default Toast;
