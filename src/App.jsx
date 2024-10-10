// App.js
import React from 'react';
import Scanner from './Scanner';
import QrCodeGenerator from './QrCodeGenerator';
import ErrorBoundary from './ErrorBoundary';

const App = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Generador y Escáner de QR</h1>
      <ErrorBoundary>
        <QrCodeGenerator />
      </ErrorBoundary>
      <hr style={{ margin: '40px 0' }} />
      <ErrorBoundary>
        <Scanner />
      </ErrorBoundary>
    </div>
  );
};

export default App;
