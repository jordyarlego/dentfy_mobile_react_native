import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from '../components/Feedback/Toast';

interface ToastContextData {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

// Criando o contexto com um valor inicial
const ToastContext = createContext<ToastContextData>({
  showToast: () => {
    console.warn('ToastContext não foi inicializado corretamente');
  }
});

// Exportando o contexto para uso em outros lugares se necessário
export { ToastContext };

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error' | 'info'>('success');

  const showToast = useCallback((newMessage: string, newType: 'success' | 'error' | 'info' = 'success') => {
    console.log('showToast chamado:', { message: newMessage, type: newType });
    setMessage(newMessage);
    setType(newType);
    setVisible(true);
  }, []);

  const hideToast = useCallback(() => {
    setVisible(false);
  }, []);

  // Criando o objeto de valor do contexto
  const value = {
    showToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast
        visible={visible}
        message={message}
        type={type}
        onHide={hideToast}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
}; 