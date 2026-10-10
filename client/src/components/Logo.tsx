export default function Logo({ withWordmark = true }: { withWordmark?: boolean }) {
  return (
    <div className="mark">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round">
        <path d="M4 20c4-1 10-6 14-14-4 1-10 4-12 9" />
        <path d="M4 20l4-4" />
      </svg>
      {withWordmark && <span className="w">Inkling</span>}
    </div>
  );
}
