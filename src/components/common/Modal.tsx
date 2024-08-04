// src/components/common/Modal.tsx

import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          borderRadius: 5,
          width: '80%',
          maxWidth: '600px',
          padding: 20,
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
          maxHeight: '80%',
          overflowY: 'auto',
        }}
      >
        <button onClick={onClose} style={{ float: 'right', cursor: 'pointer', marginBottom: 10 }}>
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
