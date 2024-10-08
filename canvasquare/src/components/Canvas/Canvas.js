import React, { useRef, useEffect, useState } from 'react';
import './canvas.css';

function Canvas() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [drawMode, setDrawMode] = useState(null); // 'square' veya null olabilir
  const [previousSquares, setPreviousSquares] = useState([]); // Kareleri saklamak için state

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Canvas'ı temizle ve önceki tüm kareleri tekrar çiz
    const redraw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height); // Temizleme işlemi
      previousSquares.forEach(square => {
        context.beginPath();
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.rect(square.startX, square.startY, square.endX - square.startX, square.endY - square.startY);
        context.stroke();
        context.closePath();
      });
    };

    redraw();

    const draw = (e) => {
      if (!isDrawing || drawMode !== 'square') return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      redraw(); // Her çizimde önceki çizimleri yeniden çiz

      context.beginPath();
      context.strokeStyle = 'black';
      context.lineWidth = 1;
      context.rect(startPoint.x, startPoint.y, x - startPoint.x, y - startPoint.y);
      context.stroke();
      context.closePath();
    };

    const startDrawing = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setStartPoint({ x, y });
      setIsDrawing(true);
    };

    const stopDrawing = (e) => {
      if (drawMode === 'square') {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setPreviousSquares(prev => [...prev, { startX: startPoint.x, startY: startPoint.y, endX: x, endY: y }]);
      }
      setIsDrawing(false);
    };

    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    return () => {
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);
    };
  }, [isDrawing, startPoint, drawMode, previousSquares]);

  const clearCanvas = () => {
    setPreviousSquares([]); // Tüm kaydedilmiş kareleri temizle
    drawMode === 'square' && setDrawMode(null); // Eğer kare çizme modundaysa modu kapat
  };

  const undo = () => {
    setPreviousSquares(prev => prev.slice(0, -1)); // En son çizilen kareyi sil
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl font-bold mb-4">Drawing with mouse events</h1>
      <div className="flex space-x-4 mb-4" id='buttons'>
        <button className="button-77" onClick={clearCanvas}>Clear Canvas</button>
        <button className="button-78" onClick={() => setDrawMode('square')}>Draw Square</button>
        <button className="button-79" onClick={undo}>Undo</button>
      </div>
      <canvas ref={canvasRef} width="560" height="360" className="border border-gray-300 shadow-xl"></canvas>
    </div>
  );
}

export default Canvas;
