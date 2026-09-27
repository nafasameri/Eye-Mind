import type { TextareaHTMLAttributes } from 'react';
import './Field.css';

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function TextArea({ label, error, id, className = '', ...rest }: Props) {
  const areaId = id ?? rest.name ?? label;
  return (
    <label className={`field ${className}`.trim()} htmlFor={areaId}>
      <span className="field__label">{label}</span>
      <textarea
        id={areaId}
        className={`field__control field__control--area ${error ? 'is-invalid' : ''}`}
        {...rest}
      />
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  );
}
