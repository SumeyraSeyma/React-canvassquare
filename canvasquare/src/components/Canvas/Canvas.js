import './canvas.css'
import React, { useRef, useEffect } from 'react';

function Canvas() {
  const myPicsRef = useRef(null);
  let isDrawing = false;
  let x = 0;
  let y = 0;

  useEffect(() => {
    const myPics = myPicsRef.current;
    const context = myPics.getContext('2d');

    const startDrawing = (e) => {
      x = e.offsetX;
      y = e.offsetY;
      isDrawing = true;
    };

    const draw = (e) => {
      if (isDrawing) {
        drawLine(context, x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
      }
    };

    const stopDrawing = () => {
      isDrawing = false;
    };

    myPics.addEventListener('mousedown', startDrawing);
    myPics.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDrawing);

    return () => {
      myPics.removeEventListener('mousedown', startDrawing);
      myPics.removeEventListener('mousemove', draw);
      window.removeEventListener('mouseup', stopDrawing);
    };
  }, []);

  function drawLine(context, x1, y1, x2, y2) {
    context.beginPath();
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
  }

  return (
    <div>
      <h1>Drawing with mouse events</h1>
      <canvas ref={myPicsRef} id="myPics" width="560" height="360"></canvas>
    </div>
  );
}

export default Canvas;