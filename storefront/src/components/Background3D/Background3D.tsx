import React from 'react';

/**
 * 3D Floating Geometric Shape (Abstract Jewelry / Runway Hoops)
 */
const IntersectingPlanes = ({ color, size, animationDelay, duration }: any) => (
  <div 
    style={{ 
      position: 'relative',
      pointerEvents: 'none',
      width: size, 
      height: size, 
      transformStyle: 'preserve-3d', 
      animation: `spin-3d ${duration} linear infinite`, 
      animationDelay 
    }}
  >
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '50%', border: `1px solid ${color}`, opacity: 0.4, transform: 'rotateX(0deg)' }} />
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '50%', border: `1px solid ${color}`, opacity: 0.4, transform: 'rotateX(60deg)' }} />
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '50%', border: `1px solid ${color}`, opacity: 0.4, transform: 'rotateX(120deg)' }} />
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '50%', border: `1px solid ${color}`, opacity: 0.4, transform: 'rotateY(90deg)' }} />
    {/* Inner glowing core */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, margin: 'auto', width: '25%', height: '25%', borderRadius: '50%', backgroundColor: color, opacity: 0.5, filter: 'blur(12px)' }} />
  </div>
);

export function Background3D() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes grid-forward {
          0% { background-position: 0 0; }
          100% { background-position: 0 60px; }
        }
        @keyframes spin-3d {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; filter: blur(40px) scale(1); }
          50% { opacity: 0.6; filter: blur(50px) scale(1.1); }
        }
      `}} />

      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none', perspective: '800px' }}>
        {/* Central Glowing Orb */}
        <div 
          style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '600px', height: '600px', borderRadius: '50%', mixBlendMode: 'screen',
            background: 'radial-gradient(circle, rgba(255, 92, 0, 0.6) 0%, transparent 60%)',
            animation: 'pulse-glow 6s ease-in-out infinite'
          }}
        />

        {/* 3D Floor Grid */}
        <div 
          style={{
            position: 'absolute', width: '300vw', height: '150vh', left: '-100vw', top: '50vh',
            backgroundImage: 'linear-gradient(to right, rgba(139, 92, 246, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(139, 92, 246, 0.4) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            transform: 'rotateX(80deg) translateY(-200px)',
            transformOrigin: 'top center',
            animation: 'grid-forward 3s linear infinite',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 40%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 40%)'
          }}
        />

        {/* 3D Ceiling Grid */}
        <div 
          style={{
            position: 'absolute', width: '300vw', height: '150vh', left: '-100vw', bottom: '50vh',
            backgroundImage: 'linear-gradient(to right, rgba(204, 255, 0, 0.15) 1px, transparent 1px), linear-gradient(to top, rgba(204, 255, 0, 0.15) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            transform: 'rotateX(-80deg) translateY(200px)',
            transformOrigin: 'bottom center',
            animation: 'grid-forward 3s linear infinite',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 40%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 40%)'
          }}
        />

        {/* Floating 3D Geometric Atoms */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', transformStyle: 'preserve-3d' }}>
           <IntersectingPlanes color="#ccff00" size={140} animationDelay="0s" duration="14s" />
        </div>
        <div style={{ position: 'absolute', bottom: '25%', right: '10%', transformStyle: 'preserve-3d' }}>
           <IntersectingPlanes color="#8b5cf6" size={200} animationDelay="-5s" duration="20s" />
        </div>
        <div style={{ position: 'absolute', top: '35%', right: '20%', transformStyle: 'preserve-3d' }}>
           <IntersectingPlanes color="#ff5c00" size={90} animationDelay="-2s" duration="10s" />
        </div>

        {/* Foreground Vignette */}
        <div 
          style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
            background: 'radial-gradient(ellipse at center, transparent 20%, #030303 80%)',
          }}
        />
      </div>
    </>
  );
}
