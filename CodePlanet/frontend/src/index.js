import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './providers/authProvider';
import { Toaster } from 'sonner';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
<Toaster  position="bottom-center" expand={true} richColors/>
  <AuthProvider>
    <App />
  </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
