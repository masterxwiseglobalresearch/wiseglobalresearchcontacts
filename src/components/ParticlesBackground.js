import React from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim'; // Use slim for stability

const ParticlesBackground = () => {
  const particlesInit = async (engine) => {
    await loadSlim(engine); // Load slim config here
  };

  const prefersReduced = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
      options={{
        fullScreen: { enable: true, zIndex: 1 },
        background: { color: { value: 'transparent' } },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: { enable: !prefersReduced, mode: 'push' },
            onHover: { enable: !prefersReduced, mode: 'repulse' },
            resize: true,
          },
          modes: {
            push: { quantity: 4 },
            repulse: { distance: 100, duration: 0.4 },
          },
        },
        particles: {
          color: { value: '#ffffff' },
          links: {
            color: '#ffffff',
            distance: 150,
            enable: !prefersReduced,
            opacity: 0.5,
            width: 1,
          },
          collisions: { enable: true },
          move: {
            enable: !prefersReduced,
            speed: prefersReduced ? 0 : 1,
            outModes: { default: 'bounce' },
          },
          number: {
            density: { enable: true, area: 800 },
            value: 50,
          },
          opacity: { value: 0.5 },
          shape: { type: 'circle' },
          size: { value: prefersReduced ? 2 : { min: 1, max: 5 } },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticlesBackground;