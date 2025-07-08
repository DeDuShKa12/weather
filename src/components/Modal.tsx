import { ReactNode, useRef } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => {
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center"
    >
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4 sm:mx-0">
        <button
          onClick={onClose}
          className="absolute top-3 z-50 right-4 text-gray-600 hover:text-black text-2xl font-bold"
        >
          ×
        </button>

        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export { Modal };
