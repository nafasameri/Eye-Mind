import type { SelectHTMLAttributes } from 'react';
import './Field.css';

type Option = { value: string; label: string };

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: Option[];
  error?: string;
};

export function Select({
  label,
  options,
  error,
  id,
  className = '',
  ...rest
}: Props) {
  const selectId = id ?? rest.name ?? label;
  return (
    <label className={`field ${className}`.trim()} htmlFor={selectId}>
      <span className="field__label">{label}</span>
      <select
        id={selectId}
        className={`field__control ${error ? 'is-invalid' : ''}`}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  );
}
