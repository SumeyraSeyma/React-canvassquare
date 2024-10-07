import './canvas.css';
import React, { useRef, useEffect, useState } from 'react';

function Canvas() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [drawMode, setDrawMode] = useState(null); // 'square' veya null olabilir

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const startDrawing = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setStartPoint({ x, y });
      setIsDrawing(true);
    };

    const draw = (e) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (drawMode === 'square') {
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas for square drawing
        const width = x - startPoint.x;
        const height = y - startPoint.y;
        context.beginPath();
        context.rect(startPoint.x, startPoint.y, width, height);
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.stroke();
        context.closePath();
      } else {
        // Serbest çizim (normal çizim)
        context.beginPath();
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.moveTo(startPoint.x, startPoint.y); // Start from the last point
        context.lineTo(x, y); // Draw to the current mouse position
        context.stroke();
        context.closePath();

        // Güncel pozisyonu yeni başlangıç noktası olarak ayarlayın
        setStartPoint({ x, y });
      }
    };

    const stopDrawing = () => {
      setIsDrawing(false);
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
    };
  }, [isDrawing, startPoint, drawMode]);

  const clearCanvas = () => {
    const context = canvasRef.current.getContext('2d');
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div>
      <div>
        <h1>Drawing with mouse events</h1>
        <button onClick={clearCanvas}>Clear Canvas</button>
        <button onClick={() => setDrawMode('square')}>Draw Square</button>
        <button onClick={() => setDrawMode(null)}>Free Draw</button>
      </div>
      <canvas ref={canvasRef} width="560" height="360" style={{ border: '1px solid black' }}></canvas>
    </div>
  );
}

export default Canvas;
