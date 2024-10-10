// Scanner.js
import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';

const Scanner = () => {
  const [scannedData, setScannedData] = useState('');
  const [error, setError] = useState(null);
  const html5QrCodeRef = useRef(null);
  const isScanningRef = useRef(false); // Usamos useRef para evitar re-renderizados innecesarios

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");
    html5QrCodeRef.current = html5QrCode;

    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      console.log(`QR Code detected: ${decodedText}`, decodedResult);
      setScannedData(decodedText);

      // Detener el escáner solo si está activo
      if (isScanningRef.current) {
        html5QrCode.stop().then(() => {
          console.log("QR Code scanning stopped.");
          isScanningRef.current = false;
        }).catch(err => {
          console.error("Unable to stop scanning.", err);
        });
      }

      // Enviar los datos al backend
      const name = decodedText;
      const timestamp = new Date().toISOString();

      axios.post('http://localhost:5000/api/save', { name, timestamp })
        .then(response => {
          console.log("Datos guardados:", response.data);
        })
        .catch(error => {
          console.error("Error al guardar los datos:", error);
        });
    };

    const qrCodeErrorCallback = (errorMessage) => {
      // Puedes manejar los errores de escaneo aquí si lo deseas
      console.warn(`Error de escaneo: ${errorMessage}`);
    };

    // Función para iniciar el escáner
    const startScanner = async () => {
      try {
        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length) {
          const cameraId = cameras[0].id;
          await html5QrCode.start(
            cameraId,
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            qrCodeSuccessCallback,
            qrCodeErrorCallback
          );
          console.log("QR Code scanning started.");
          isScanningRef.current = true;
        } else {
          setError("No se encontraron cámaras.");
        }
      } catch (err) {
        console.error("Error al iniciar el escáner:", err);
        setError("Error al iniciar el escáner. Asegúrate de que el navegador tenga permisos para acceder a la cámara.");
      }
    };

    // Iniciar el escáner al montar el componente
    startScanner();

    // Limpiar el escáner al desmontar el componente
    return () => {
      if (html5QrCodeRef.current && isScanningRef.current) {
        html5QrCodeRef.current.stop().then(() => {
          console.log("Escáner detenido.");
          isScanningRef.current = false;
        }).catch(err => {
          console.error("Error al detener el escáner:", err);
        });
      }
    };
  }, []); // Empty dependency array to run once

  return (
    <div>
      <h2>Escáner de QR</h2>
      {error ? (
        <div style={{ color: 'red' }}>Error: {error}</div>
      ) : (
        <div id="reader" style={{ width: "100%", maxWidth: "500px", height: "400px", border: "1px solid black" }}></div>
      )}
      {scannedData && (
        <div style={{ marginTop: '20px' }}>
          <strong>Escaneado:</strong> {scannedData}
        </div>
      )}
    </div>
  );
};

export default Scanner;
