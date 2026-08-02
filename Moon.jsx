import React, { memo } from 'react';

const MOON_ANCHOR = {
  left: '65%',
  transform: 'translateX(-50%)',
  zIndex: 2,
};

const MOON_STYLE = {
  position: 'absolute',
  ...MOON_ANCHOR,
  width: 56,
  height: 56,
  borderRadius: '48% 52% 47% 53%',
  background:
    'radial-gradient(circle at 38% 34%, #FFFDFD 0%, #FCEEEF 28%, #F3D7DA 55%, #E2B9BF 82%, #C99BA3 100%)',
  boxShadow:
    'inset -9px -7px 14px rgba(90,45,55,0.3), inset 3px 3px 8px rgba(255,255,255,0.55)',
  overflow: 'hidden',
};

const GLOW_STYLE = {
  position: 'absolute',
  ...MOON_ANCHOR,
  width: 140,
  height: 140,
  borderRadius: '50%',
  background:
    'radial-gradient(circle, rgba(247,222,225,0.24) 0%, rgba(247,222,225,0) 70%)',
};

const CRATERS = [
  {
    width: 11,
    height: 11,
    top: 12,
    left: 14,
    background: 'rgba(150,105,115,0.28)',
    boxShadow: 'inset -2px -2px 3px rgba(90,45,55,0.25)',
  },
  {
    width: 7,
    height: 7,
    top: 27,
    left: 30,
    background: 'rgba(150,105,115,0.25)',
    boxShadow: 'inset -1px -1px 2px rgba(90,45,55,0.2)',
  },
  {
    width: 5,
    height: 5,
    top: 36,
    left: 12,
    background: 'rgba(150,105,115,0.22)',
  },
];

function Moon({ bottom, glowBottom }) {
  return (
    <>
      <div style={{ ...GLOW_STYLE, bottom: glowBottom }} />
      <div style={{ ...MOON_STYLE, bottom }}>
        {CRATERS.map((crater, i) => (
          <div
            key={i}
            style={{ position: 'absolute', borderRadius: '50%', ...crater }}
          />
        ))}
      </div>
    </>
  );
}

export default memo(Moon);
