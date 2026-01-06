import React from 'react';
import './threeD.css';

export default function ThreeDCube({ size = 140 }) {
  const style = { width: size, height: size };
  return (
    <div className="cube-frame" style={style} aria-hidden="true">
      <div className="cube">
        <div className="face front" />
        <div className="face back" />
        <div className="face right" />
        <div className="face left" />
        <div className="face top" />
        <div className="face bottom" />
      </div>
    </div>
  );
}