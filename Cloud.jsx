import React, { memo } from 'react';

const PUFF_STYLES = {
  puff1: {
    width: 40,
    height: 22,
    borderRadius: '50%',
    background: 'linear-gradient(#F3F5F8, #C7CDD6)',
    boxShadow: '0 3px 6px rgba(0,0,0,0.25)',
  },
  puff2: {
    width: 32,
    height: 26,
    borderRadius: '50%',
    background: 'linear-gradient(#FBFCFE, #D2D8E0)',
    boxShadow: '0 2px 5px rgba(0,0,0,0.22)',
  },
  puff3: {
    width: 30,
    height: 24,
    borderRadius: '50%',
    background: 'linear-gradient(#F8FAFC, #C7CDD6)',
    boxShadow: '0 2px 5px rgba(0,0,0,0.22)',
  },
};

function Cloud({ top, left, scale, driftDuration, animate = true }) {
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      <div
        style={{
          position: 'relative',
          ...(animate && {
            animation: `cloudDrift ${driftDuration}s ease-in-out infinite alternate`,
          }),
        }}
      >
        <div style={{ position: 'absolute', left: 0, bottom: 0, ...PUFF_STYLES.puff2 }} />
        <div style={{ position: 'absolute', right: 0, bottom: 0, ...PUFF_STYLES.puff3 }} />
        <div style={{ position: 'absolute', left: 11, bottom: 0, ...PUFF_STYLES.puff1 }} />
      </div>
    </div>
  );
}

export default memo(Cloud);
