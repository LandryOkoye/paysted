"use client";

// Reusable in-app confirmation dialog.
// Usage: render it conditionally and pass onConfirm / onCancel handlers.
// Do NOT use window.confirm() — this component replaces it everywhere.

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  /** Called when the user clicks the destructive action button */
  onConfirm: () => void;
  /** Called when the user cancels (also fires when clicking the backdrop) */
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop — clicking it cancels */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog box */}
      <div className="relative z-10 w-full max-w-sm bg-[#111827] border border-white/[0.08] rounded-2xl p-6 shadow-2xl">

        <h3 className="text-base font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            id="confirm-dialog-cancel"
            onClick={onCancel}
            className="
              flex-1 py-2.5 rounded-xl text-sm font-semibold
              border border-white/[0.10] text-slate-300
              hover:bg-white/[0.05] transition-all
            "
          >
            Cancel
          </button>
          <button
            id="confirm-dialog-confirm"
            onClick={onConfirm}
            className="
              flex-1 py-2.5 rounded-xl text-sm font-bold
              bg-rose-500 hover:bg-rose-400 active:bg-rose-600
              text-white transition-all
            "
          >
            {confirmLabel}
          </button>
        </div>

      </div>
    </div>
  );
}
