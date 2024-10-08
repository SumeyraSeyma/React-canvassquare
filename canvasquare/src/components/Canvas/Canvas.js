import React, { useRef, useEffect, useState } from 'react';
import './canvas.css';

function Canvas() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [drawMode, setDrawMode] = useState(null);
  const [previousSquares, setPreviousSquares] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const redraw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
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

    const getTouchPosition = (e) => {
      const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0] || e.changedTouches[0];
  const scaleX = canvas.width / rect.width;   // Gerçek canvas genişliği ile stil genişliği arasındaki oran
  const scaleY = canvas.height / rect.height; // Gerçek canvas yüksekliği ile stil yüksekliği arasındaki oran
  return {
    x: (touch.clientX - rect.left) * scaleX, // Dokunma X koordinatını ölçeklendir
    y: (touch.clientY - rect.top) * scaleY   // Dokunma Y koordinatını ölçeklendir
  };
};

    const draw = (e) => {
      if (!isDrawing || drawMode !== 'square') return;
      let x, y;
      const rect = canvas.getBoundingClientRect();
      if (e.type.includes('mouse')) {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      } else { // Touch olayları için
        const touchPos = getTouchPosition(e);
        x = touchPos.x;
        y = touchPos.y;
      }

      redraw();

      context.beginPath();
      context.strokeStyle = 'black';
      context.lineWidth = 1;
      context.rect(startPoint.x, startPoint.y, x - startPoint.x, y - startPoint.y);
      context.stroke();
      context.closePath();
    };

    const startDrawing = (e) => {
      if (drawMode === 'square') {
        let x, y;
        const rect = canvas.getBoundingClientRect();
        if (e.type.includes('mouse')) {
          x = e.clientX - rect.left;
          y = e.clientY - rect.top;
        } else { // Touch olayları için
          const touchPos = getTouchPosition(e);
          x = touchPos.x;
          y = touchPos.y;
        }

        if (x >= 0 && y >= 0 && x <= canvas.width && y <= canvas.height) {
          setStartPoint({ x, y });
          setIsDrawing(true);
        }
      }
    };

    const stopDrawing = (e) => {
      if (drawMode === 'square' && isDrawing) {
        let x, y;
        const rect = canvas.getBoundingClientRect();
        if (e.type.includes('mouse')) {
          x = e.clientX - rect.left;
          y = e.clientY - rect.top;
        } else { // Touch olayları için
          const touchPos = getTouchPosition(e);
          x = touchPos.x;
          y = touchPos.y;
        }

        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x > canvas.width) x = canvas.width;
        if (y > canvas.height) y = canvas.height;

        setPreviousSquares(prev => [...prev, { startX: startPoint.x, startY: startPoint.y, endX: x, endY: y }]);
      }
      setIsDrawing(false);
    };

    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);

    return () => {
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchend', stopDrawing);
      canvas.removeEventListener('touchcancel', stopDrawing);
    };
  }, [isDrawing, startPoint, drawMode, previousSquares]);

  const clearCanvas = () => {
    setPreviousSquares([]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    previousSquares.forEach(square => {
      context.beginPath();
      context.strokeStyle = 'black';
      context.lineWidth = 1;
      context.rect(square.startX, square.startY, square.endX - square.startX, square.endY - square.startY);
      context.stroke();
      context.closePath();
    });
  }, [previousSquares]);

  const undo = () => {
    setPreviousSquares(prev => prev.slice(0, -1));
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

