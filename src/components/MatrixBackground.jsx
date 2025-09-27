import React, { useEffect, useRef, useState } from "react";

const MatrixBackground = ({charset}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w, h, p;
    const size = 16;
    const fps = 32;
    const color = "#00ff00";

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      p = Array(Math.ceil(w / size)).fill(0);
    };

    const random = (items) => items[Math.floor(Math.random() * items.length)];

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,.05)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = color;
      ctx.font = `${size}px monospace`;

      for (let i = 0; i < p.length; i++) {
        const v = p[i];
        ctx.fillText(random(charset), i * size, v);
        p[i] = v >= h || v >= 10000 * Math.random() ? 0 : v + size;
      }
    };

    resize();
    window.addEventListener("resize", resize);
    const interval = setInterval(draw, 1000 / fps);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, [charset]);

  return (
    <>
      <canvas
        ref={canvasRef}
        id="canvas"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: -1,
          width: "100%",
          height: "100%",
        }}
      />
    </>
  );
};

export default MatrixBackground;