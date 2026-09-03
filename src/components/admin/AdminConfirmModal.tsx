import React from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';

interface AdminConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AdminConfirmModal: React.FC<AdminConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete Permanently',
  cancelLabel = 'Cancel',
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scaleIn text-stone-900">
        
        {/* Header */}
        <div className="p-5 sm:p-6 flex items-start justify-between border-b border-stone-100">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isDestructive ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-stone-100 text-stone-800'
            }`}>
              {isDestructive ? <Trash2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-950 uppercase tracking-tight">
                {title}
              </h3>
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Admin Action Confirmation
              </span>
            </div>
          </div>

          <button
            onClick={onCancel}
            disabled={isLoading}
            className="p-2 text-stone-400 hover:text-stone-700 disabled:opacity-40 rounded-xl transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Body */}
        <div className="p-5 sm:p-6">
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-4 sm:p-6 pt-0 bg-stone-50/50 flex items-center justify-end space-x-2.5 border-t border-stone-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="bg-white hover:bg-stone-100 disabled:opacity-40 text-stone-800 border border-stone-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs flex items-center space-x-2 disabled:opacity-60 ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-stone-950 hover:bg-black text-white'
            }`}
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{isLoading ? 'Processing Database...' : confirmLabel}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
