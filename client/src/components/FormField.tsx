import { useState, type HTMLInputTypeAttribute } from "react";

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  disabled?: boolean;
}

export function FormField({
  id, label, value, onChange, type = "text", placeholder, autoComplete, error, disabled,
}: Props) {
  return (
    <div className="fld">
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} value={value} placeholder={placeholder} autoComplete={autoComplete}
        disabled={disabled} aria-invalid={!!error} onChange={(e) => onChange(e.target.value)} />
      <p className="err" role="alert">{error}</p>
    </div>
  );
}

export function PasswordField({
  id, label, value, onChange, placeholder, autoComplete, error, disabled,
}: Omit<Props, "type">) {
  const [shown, setShown] = useState(false);
  return (
    <div className="fld">
      <label htmlFor={id}>{label}</label>
      <div className="pw">
        <input id={id} type={shown ? "text" : "password"} value={value} placeholder={placeholder}
          autoComplete={autoComplete} disabled={disabled} aria-invalid={!!error}
          onChange={(e) => onChange(e.target.value)} />
        <button type="button" onClick={() => setShown((s) => !s)} aria-pressed={shown}>
          {shown ? "Hide" : "Show"}
        </button>
      </div>
      <p className="err" role="alert">{error}</p>
    </div>
  );
}