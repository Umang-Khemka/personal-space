export default function ToastStack({ messages }: { messages: string[] }) {
  return (
    <div id="toasts" aria-live="polite">
      {messages.map((m, i) => <div className="toast" key={i}>{m}</div>)}
    </div>
  );
}
