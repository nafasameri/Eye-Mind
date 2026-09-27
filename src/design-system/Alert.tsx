import type { ReactNode } from 'react';
import './Alert.css';

type Tone = 'info' | 'success' | 'warning' | 'danger';

type Props = {
  tone?: Tone;
  title?: string;
  children: ReactNode;
};

export function Alert({ tone = 'info', title, children }: Props) {
  return (
    <div className={`alert alert--${tone}`} role="alert">
      {title ? <strong className="alert__title">{title}</strong> : null}
      <div className="alert__body">{children}</div>
    </div>
  );
}
