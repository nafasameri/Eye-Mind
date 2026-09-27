import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...rest
}: Props) {
  return (
    <button
      className={`btn btn--${variant} btn--${size} ${className}`.trim()}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <span className="btn__spinner" aria-hidden /> : null}
      <span>{children}</span>
    </button>
  );
}
