import React from 'react';
import styles from './CustomConfirmDialog.module.css';

interface CustomConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
}

const CustomConfirmDialog: React.FC<CustomConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar"
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    // Aplica a classe do overlay
    <div className={styles.confirmDialogOverlay} onClick={onClose}> {/* Adicionado onClick no overlay para fechar */}
      {/* Aplica a classe do conteúdo e impede que o clique no conteúdo feche o modal */}
      <div className={styles.confirmDialogContent} onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className={styles.confirmDialogActions}>
          <button onClick={onClose} className={styles.cancelButton}>
            {cancelText}
          </button>
          <button onClick={onConfirm} className={styles.confirmButton}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomConfirmDialog;