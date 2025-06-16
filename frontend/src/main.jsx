import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserProvider } from './pages/UserContext'; // import context

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <UserProvider>
    <App />
  </UserProvider>
</React.StrictMode>
);