import type { ReactNode } from 'react';
import './Panel.css';

type Props = {
  title?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
};

/** Interactive/content container — use only where grouping aids forms or lists */
export function Panel({ title, children, className = '', actions }: Props) {
  return (
    <section className={`panel ${className}`.trim()}>
      {(title || actions) && (
        <header className="panel__header">
          {title ? <h3 className="panel__title">{title}</h3> : <span />}
          {actions}
        </header>
      )}
      <div className="panel__body">{children}</div>
    </section>
  );
}
