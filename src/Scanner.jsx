// Scanner.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';

const Scanner = () => {
  const [scannedData, setScannedData] = useState('');
  const [error, setError] = useState(null);
  const html5QrCodeRef = useRef(null);
  const isScanningRef = useRef(false);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");
    html5QrCodeRef.current = html5QrCode;

    return () => {
      stopScanner(); // Detener escáner si el componente se desmonta
    };
  }, []);

  const startScanner = async () => {
    try {
      const cameras = await Html5Qrcode.getCameras();
      if (cameras && cameras.length) {
        const cameraId = cameras[0].id;
        await html5QrCodeRef.current.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          qrCodeSuccessCallback,
          qrCodeErrorCallback
        );
        console.log("Escaneo de QR Code iniciado.");
        isScanningRef.current = true;
      } else {
        setError("No se encontraron cámaras.");
      }
    } catch (err) {
      console.error("Error al iniciar el escáner:", err);
      setError("Error al iniciar el escáner. Asegúrate de que el navegador tenga permisos para acceder a la cámara.");
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && isScanningRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        console.log("Escáner detenido.");
        isScanningRef.current = false;
      } catch (err) {
        console.error("Error al detener el escáner:", err);
      }
    } else {
      console.log("El escáner ya está detenido o no se ha iniciado.");
    }
  };

  const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    console.log(`QR Code detectado: ${decodedText}`, decodedResult);
    setScannedData(decodedText);

    if (isScanningRef.current) {
      html5QrCodeRef.current.stop()
        .then(() => {
          console.log("Escaneo de QR Code detenido.");
          isScanningRef.current = false;
          const name = decodedText;
          const timestamp = new Date().toISOString();

          console.log("Enviando datos al backend:", { name, timestamp });

          axios.post(`http://localhost:5000/api/save`, { name, timestamp })
            .then(response => {
              console.log("Datos guardados:", response.data);
            })
            .catch(error => {
              if (error.response) {
                console.error("Error en la respuesta del servidor:", error.response.data);
              } else if (error.request) {
                console.error("No se recibió respuesta del servidor:", error.request);
              } else {
                console.error("Error al configurar la solicitud:", error.message);
              }
            });
        }).catch(err => {
          console.error("No se pudo detener el escaneo.", err);
        });
    }
  };

  const qrCodeErrorCallback = (errorMessage) => {
    console.warn(`Error de escaneo: ${errorMessage}`);
  };

  const [options, setOptions] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5000/api/show')
      .then(response => response.json())
      .then(data => setOptions(data))
      .catch(err => console.err('Error al traer los datos', err));
  }, []);

  return (
    <div>
      <h2>Escáner de QR</h2>
      {error ? (
        <div style={{ color: 'red' }}>Error: {error}</div>
      ) : (
        <>
          <button onClick={startScanner}>Iniciar Escáner</button>
          <button onClick={stopScanner} >
            Detener Escáner
          </button>
          <div id="reader" style={{ width: "100%", maxWidth: "500px", height: "400px", border: "1px solid black" }}></div>
        </>
      )}
      {scannedData && (
        <div style={{ marginTop: '20px' }}>
          <strong>Escaneado:</strong> {scannedData}
        </div>
      )}

      {options.map((option) => (
        <div key={option.Id}>
          {option.Nombre}
          {option.Hora}
        </div>
      ))}
    </div>
  );
};

export default Scanner;
