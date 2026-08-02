import React, { memo } from 'react';

function Star({
  left,
  top,
  size,
  twinkleDuration,
  twinkleDelay,
  driftDuration,
  animate = true,
}) {
  const starStyle = {
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: '50%',
    background: '#AEDFFF',
  };

  if (animate) {
    starStyle.animation = `twinkle ${twinkleDuration}s ease-in-out ${twinkleDelay}s infinite`;
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: `${left}%`,
        top: `${top}%`,
        ...(animate && {
          animation: `drift ${driftDuration}s ease-in-out infinite alternate`,
        }),
      }}
    >
      <div style={starStyle} />
    </div>
  );
}

export default memo(Star);
