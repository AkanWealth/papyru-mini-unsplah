import React from 'react';
import { Blurhash } from 'react-blurhash';

const LoadingScreen: React.FC<{ blurHash?: string }> = ({ blurHash }) => {
  return (
    <div className="rounded-lg overflow-hidden">
      {blurHash ? (
        <Blurhash
          hash={blurHash}
          width="100%"
          height="100%"
          resolutionX={32}
          resolutionY={32}
          punch={1}
        />
      ) : (
        <div className="bg-gray-300 animate-pulse" style={{ width: '100%', height: '100%' }} />
      )}
    </div>
  );
};

export default LoadingScreen;