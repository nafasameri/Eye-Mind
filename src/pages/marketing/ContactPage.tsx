import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Input, Panel, TextArea } from '../../design-system';
import './marketing.css';

export function ContactPage() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section className="page-section">
      <div className="container narrow">
        <h1>{t('contact.title')}</h1>
        <p className="lead">{t('contact.lead')}</p>
        <Panel>
          {sent ? (
            <Alert tone="success">{t('contact.success')}</Alert>
          ) : (
            <form className="form-stack" onSubmit={onSubmit}>
              <Input label={t('contact.name')} name="name" required />
              <Input label={t('contact.email')} name="email" type="email" required />
              <TextArea label={t('contact.message')} name="message" required />
              <div className="form-actions">
                <Button type="submit">{t('contact.send')}</Button>
              </div>
            </form>
          )}
        </Panel>
      </div>
    </section>
  );
}
