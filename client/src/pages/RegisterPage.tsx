import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { FormField, PasswordField } from "../components/FormField";
import { validateEmail } from "../lib/validation";
import { useAuthStore } from "../store/auth.store";

interface Errors { username?: string; email?: string; password?: string; confirm?: string }

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuthStore();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    clearError();
    return clearError;
  }, [clearError]);

  const edit = (field: keyof Errors) => (v: string) => {
    setForm((f) => ({ ...f, [field]: v }));
    setErrors((e) => ({ ...e, [field]: undefined }));
    if (error) clearError();
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const username = form.username.trim();
    const email = form.email.trim();
    const next: Errors = {
      username: username.length < 2 ? "Choose a username with at least 2 characters." : undefined,
      email: validateEmail(email),
      password: form.password.length < 8 ? "Use at least 8 characters." : undefined,
      confirm: !form.confirm || form.confirm !== form.password ? "Passwords don't match." : undefined,
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    if (await register(username, email, form.password)) navigate("/", { replace: true });
  };

  return (
    <AuthLayout>
      <form noValidate onSubmit={onSubmit}>
        <h1>Make room for your thoughts.</h1>
        <p className="sub">A private corner of the internet, just for you.</p>
        {error && <div className="banner" role="alert">{error}</div>}
        <FormField id="ru" label="Username" autoComplete="username" placeholder="What should we call you?"
          value={form.username} onChange={edit("username")} error={errors.username} disabled={loading} />
        <FormField id="re" label="Email" type="email" autoComplete="email" placeholder="you@example.com"
          value={form.email} onChange={edit("email")} error={errors.email} disabled={loading} />
        <PasswordField id="rp" label="Password" autoComplete="new-password" placeholder="At least 8 characters"
          value={form.password} onChange={edit("password")} error={errors.password} disabled={loading} />
        <PasswordField id="rc" label="Confirm password" autoComplete="new-password" placeholder="Type it once more"
          value={form.confirm} onChange={edit("confirm")} error={errors.confirm} disabled={loading} />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "One moment…" : "Create your space"}
        </button>
        <p className="alt">Already have a space? <Link to="/login">Sign in</Link></p>
      </form>
    </AuthLayout>
  );
}