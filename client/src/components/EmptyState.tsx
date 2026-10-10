import { Link } from "react-router-dom";

interface Props {
  title: string;
  message: string;
  actionLabel?: string;
  /** Route to navigate to; swap for an onClick that opens the editor later. */
  actionTo?: string;
}

export default function EmptyState({ title, message, actionLabel, actionTo = "/" }: Props) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      <p>{message}</p>
      {actionLabel && <Link className="btn" to={actionTo}>{actionLabel}</Link>}
    </div>
  );
}
