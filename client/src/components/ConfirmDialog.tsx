interface Props {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export default function ConfirmDialog({
  title, message, confirmLabel = "Confirm", cancelLabel = "Keep it", danger = true, onConfirm, onCancel,
}: Props) {
  return (
    <div className="ov" style={{ zIndex: 80 }}>
      <div className="card" role="alertdialog" style={{ maxWidth: 380 }}>
        <h3>{title}</h3>
        <p style={{ color: "var(--mute)" }}>{message}</p>
        <div className="foot" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="btn ghost" onClick={onCancel}>{cancelLabel}</button>
          <button type="button" className={`btn${danger ? " danger" : ""}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
