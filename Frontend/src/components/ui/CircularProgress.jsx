// eslint-disable-next-line no-unused-vars
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// eslint-disable-next-line react/prop-types
export default function CircularProgress({ progress }) {
  // Determine completion directly
  const completed = progress >= 100;

  // Constants
  const size = 160;
  const strokeWidth = 10;
  const successLottieSrc = 'https://assets10.lottiefiles.com/packages/lf20_jbrw3hcz.json';

  // SVG Calculations
  const radius = size / 2;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      {!completed ? (
        <>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label={`Uploading ${progress}%`}
            style={{ width: size, height: size }}
            className="relative"
          >
            <svg height={size} width={size} className="transform -rotate-90">
              <circle
                stroke="#161517"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="#4ade80"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                style={{ transition: 'stroke-dashoffset 0.2s linear' }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-semibold">{progress}%</span>
              <span className="text-xs mt-1">Uploading...</span>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground text-center">
            Your files are being processing...
          </p>
        </>
      ) : (
        <div
          className="relative flex flex-col items-center"
          style={{ width: size * 2, height: size * 2 }}
        >
          <DotLottieReact
            src={successLottieSrc}
            autoplay
            loop={false}
            style={{ width: '100%', height: '100%' }}
          />
          <p className="absolute bottom-16 text-[#4ade80] font-bold text-2xl ">Upload Complete</p>
        </div>
      )}
    </div>
  );
}
