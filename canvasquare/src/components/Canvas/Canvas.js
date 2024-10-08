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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl font-bold mb-4">Drawing with mouse events</h1>
      <div className="flex space-x-4 mb-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={clearCanvas}>Clear Canvas</button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => setDrawMode('square')}>Draw Square</button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => setDrawMode(null)}>Free Draw</button>
      </div>
      <canvas ref={canvasRef} width="560" height="360" className="border border-gray-300"></canvas>
    </div>
  );
}

export default Canvas;
