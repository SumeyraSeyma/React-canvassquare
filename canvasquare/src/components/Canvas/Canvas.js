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
        context.beginPath();
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.rect(startPoint.x, startPoint.y, x - startPoint.x, y - startPoint.y);
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

    const stopDrawing = (e) => {
      draw(e);
      setIsDrawing(false);
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);
    };
  }, [isDrawing, startPoint, drawMode]);

  const clearCanvas = () => {
    const context = canvasRef.current.getContext('2d');
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl font-bold mb-4">Drawing with mouse events</h1>
      <div className="flex space-x-4 mb-4">
        <button className="button-77" onClick={clearCanvas}>Clear Canvas</button>
        <button className="button-78" onClick={() => setDrawMode('square')}>Draw Square</button>
        <button className="button-79" onClick={() => setDrawMode(null)}>Draw Line</button>
      </div>
      <canvas ref={canvasRef} width="560" height="360" className="border border-gray-300"></canvas>
    </div>
  );
}

export default Canvas;
