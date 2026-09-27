import type { ReactNode } from 'react';
import './Badge.css';

type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

type Props = {
  children: ReactNode;
  tone?: Tone;
};

export function Badge({ children, tone = 'neutral' }: Props) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}
