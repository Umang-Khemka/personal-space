import { Link } from "react-router-dom";

interface Props {
  title: string;
  message: string;
  actionLabel?: string;
  /** Link target. Ignored when onAction is given. */
  actionTo?: string;
  /** Use this to open the editor instead of navigating. */
  onAction?: () => void;
}

export default function EmptyState({ title, message, actionLabel, actionTo = "/", onAction }: Props) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      <p>{message}</p>
      {actionLabel && (onAction
        ? <button type="button" className="btn" onClick={onAction}>{actionLabel}</button>
        : <Link className="btn" to={actionTo}>{actionLabel}</Link>)}
    </div>
  );
}