// QrCodeGenerator.js
import React, { useState } from 'react';
import QRCode from 'react-qr-code';

const QrCodeGenerator = () => {
  const [name, setName] = useState('');

  const handleChange = (event) => {
    setName(event.target.value);
  };

  return (
    <div>
      <h2>Generador de QR</h2>
      <input
        type="text"
        value={name}
        onChange={handleChange}
        placeholder="Ingresa tu nombre"
        style={{
          padding: '10px',
          fontSize: '16px',
          width: '100%',
          maxWidth: '400px',
          marginBottom: '20px',
        }}
      />
      {name && (
        <div style={{ marginTop: '20px' }}>
          <QRCode value={name} size={256} />
        </div>
      )}
    </div>
  );
};

export default QrCodeGenerator;
