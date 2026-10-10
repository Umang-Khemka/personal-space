export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const validateEmail = (v: string) =>
  !v ? "Enter your email." : !EMAIL_RE.test(v) ? "That email doesn't look right." : undefined;