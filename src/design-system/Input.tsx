import type { InputHTMLAttributes } from 'react';
import './Field.css';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export function Input({ label, error, hint, id, className = '', ...rest }: Props) {
  const inputId = id ?? rest.name ?? label;
  return (
    <label className={`field ${className}`.trim()} htmlFor={inputId}>
      <span className="field__label">{label}</span>
      <input id={inputId} className={`field__control ${error ? 'is-invalid' : ''}`} {...rest} />
      {hint && !error ? <span className="field__hint">{hint}</span> : null}
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  );
}
