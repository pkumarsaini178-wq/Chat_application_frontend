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
    'radial-gradient(circle at 38% 34%, #FFFFFF 0%, #FFFDFD 20%, #FBE9EC 42%, #F0CFD5 68%, #DBA2AC 88%, #B37784 100%)',
  boxShadow:
    'inset -10px -8px 16px rgba(90,45,55,0.42), inset 4px 4px 10px rgba(255,255,255,0.6), 0 0 26px rgba(247,222,225,0.4)',
  overflow: 'hidden',
};

const GLOW_STYLE = {
  position: 'absolute',
  ...MOON_ANCHOR,
  width: 140,
  height: 140,
  borderRadius: '50%',
  background:
    'radial-gradient(circle, rgba(247,222,225,0.3) 0%, rgba(255,255,255,0.12) 42%, rgba(247,222,225,0) 72%)',
};

const CRATERS = [
  {
    width: 12,
    height: 12,
    top: 12,
    left: 13,
    background: 'rgba(150,105,115,0.3)',
    boxShadow:
      'inset 1px 1px 2px rgba(255,255,255,0.45), inset -2px -2px 4px rgba(90,45,55,0.32)',
  },
  {
    width: 7,
    height: 7,
    top: 27,
    left: 30,
    background: 'rgba(150,105,115,0.26)',
    boxShadow:
      'inset 1px 1px 1px rgba(255,255,255,0.4), inset -1px -1px 2px rgba(90,45,55,0.26)',
  },
  {
    width: 5,
    height: 5,
    top: 36,
    left: 12,
    background: 'rgba(150,105,115,0.24)',
    boxShadow:
      'inset 1px 1px 1px rgba(255,255,255,0.35), inset -1px -1px 2px rgba(90,45,55,0.22)',
  },
  {
    width: 4,
    height: 4,
    top: 20,
    left: 38,
    background: 'rgba(150,105,115,0.22)',
    boxShadow:
      'inset 1px 1px 1px rgba(255,255,255,0.3), inset -1px -1px 1px rgba(90,45,55,0.2)',
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
