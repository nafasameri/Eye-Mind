import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n';
import './design-system/tokens.css';
import './design-system/Panel.css';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
