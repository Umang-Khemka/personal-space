import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { FormField, PasswordField } from "../components/FormField";
import { validateEmail } from "../lib/validation";
import { useAuthStore } from "../store/auth.store";

interface Errors { email?: string; password?: string }

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  // Don't carry a stale server error over from another page.
  useEffect(() => {
    clearError();
    return clearError;
  }, [clearError]);

  const edit = (setter: (v: string) => void, field: keyof Errors) => (v: string) => {
    setter(v);
    setErrors((e) => ({ ...e, [field]: undefined }));
    if (error) clearError();
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const trimmed = email.trim();
    const next: Errors = {
      email: validateEmail(trimmed),
      password: password ? undefined : "Enter your password.",
    };
    setErrors(next);
    if (next.email || next.password) return;
    if (await login(trimmed, password)) navigate("/", { replace: true });
  };

  return (
    <AuthLayout>
      <form noValidate onSubmit={onSubmit}>
        <h1>Welcome back to your space.</h1>
        <p className="sub">Your thoughts and memories are right where you left them.</p>
        {error && <div className="banner" role="alert">{error}</div>}
        <FormField id="le" label="Email" type="email" autoComplete="email" placeholder="you@example.com"
          value={email} onChange={edit(setEmail, "email")} error={errors.email} disabled={loading} />
        <PasswordField id="lp" label="Password" autoComplete="current-password" placeholder="Your password"
          value={password} onChange={edit(setPassword, "password")} error={errors.password} disabled={loading} />
        <p style={{ textAlign: "right", margin: "-4px 0 14px" }}>
          {/* TODO: link to your password-reset flow */}
          <a className="link" href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a>
        </p>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "One moment…" : "Sign in"}
        </button>
        <p className="alt">New here? <Link to="/register">Create an account</Link></p>
      </form>
    </AuthLayout>
  );
}