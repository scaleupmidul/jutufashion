import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  variant?: 'color' | 'white';
}

/**
 * Official bKash Origami Bird Vector Icon
 */
export const BkashIcon: React.FC<LogoProps> = ({ className = 'w-6 h-6', size, variant = 'color' }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    aria-label="bKash Logo"
  >
    {/* bKash Origami Bird official paths */}
    <g transform="translate(6, 6) scale(0.88)">
      {variant === 'white' ? (
        <>
          <polygon points="76,8 96,28 73,34" fill="#ffffff" fillOpacity="0.9" />
          <polygon points="73,34 96,28 66,72" fill="#ffffff" />
          <polygon points="34,8 76,8 52,42" fill="#ffffff" fillOpacity="0.8" />
          <polygon points="52,42 73,34 66,72 40,54" fill="#ffffff" />
          <polygon points="4,38 34,8 40,54" fill="#ffffff" fillOpacity="0.75" />
          <polygon points="4,38 40,54 36,88" fill="#ffffff" fillOpacity="0.85" />
          <polygon points="40,54 66,72 36,88" fill="#ffffff" fillOpacity="0.95" />
        </>
      ) : (
        <>
          {/* Top beak / head */}
          <polygon points="76,8 96,28 73,34" fill="#DF146E" />
          {/* Upper wing */}
          <polygon points="73,34 96,28 66,72" fill="#E2136E" />
          {/* Upper torso / crest */}
          <polygon points="34,8 76,8 52,42" fill="#C40E5E" />
          {/* Main body center */}
          <polygon points="52,42 73,34 66,72 40,54" fill="#E2136E" />
          {/* Left wing / tail flap */}
          <polygon points="4,38 34,8 40,54" fill="#A8094E" />
          {/* Lower body base */}
          <polygon points="4,38 40,54 36,88" fill="#C40E5E" />
          {/* Bottom tail wedge */}
          <polygon points="40,54 66,72 36,88" fill="#DF146E" />
        </>
      )}
    </g>
  </svg>
);

/**
 * Official Nagad Swirl / Flame Vector Icon
 */
export const NagadIcon: React.FC<LogoProps> = ({ className = 'w-6 h-6', size, variant = 'color' }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    aria-label="Nagad Logo"
  >
    <defs>
      <linearGradient id="nagadGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F9A01B" />
        <stop offset="100%" stopColor="#ED1C24" />
      </linearGradient>
      <linearGradient id="nagadGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#E52327" />
        <stop offset="100%" stopColor="#F37023" />
      </linearGradient>
    </defs>
    {/* Nagad circular stylized swirling bird / flame */}
    <g transform="translate(5, 5) scale(0.9)">
      {variant === 'white' ? (
        <>
          <path
            d="M50 4C24.6 4 4 24.6 4 50c0 14.2 6.5 26.9 16.8 35.3-2.1-7.8-1.5-16.8 2.2-24.8 5.6-12.1 17.5-19.8 30.6-20.2 1.8 0 3.6.2 5.4.5C51.2 32.2 40.5 24 28.5 24c-2.3 0-4.5.3-6.6.8C28.8 14.8 38.7 8.5 50 8.5c22.9 0 41.5 18.6 41.5 41.5 0 8.4-2.5 16.2-6.8 22.8 5.8-6.3 9.3-14.7 9.3-23.9 0-24.8-20-44.9-44-44.9z"
            fill="#ffffff"
            fillOpacity="0.95"
          />
          <path
            d="M62 48c-7.2 0-13.8 3.6-17.7 9.5-4.2 6.4-4.6 14.5-1.1 21.3 4.2 8.2 12.6 13.2 21.8 13.2 14.9 0 27-12.1 27-27 0-4.1-1-8-2.6-11.4-2.8-5.8-8.7-9.6-15.4-9.6-4 0-7.8 1.4-10.8 3.8 3.2-1.2 6.7-1.8 10.3-1.8 11.6 0 21 9.4 21 21 0 7.8-4.3 14.7-10.7 18.2-1.9-4.2-2.1-9-.6-13.5 2.1-6.4 7.3-10.9 13.7-11.7C90 53.6 77 48 62 48z"
            fill="#ffffff"
          />
        </>
      ) : (
        <>
          {/* Main outer dynamic curve */}
          <path
            d="M50 4C24.6 4 4 24.6 4 50c0 14.2 6.5 26.9 16.8 35.3-2.1-7.8-1.5-16.8 2.2-24.8 5.6-12.1 17.5-19.8 30.6-20.2 1.8 0 3.6.2 5.4.5C51.2 32.2 40.5 24 28.5 24c-2.3 0-4.5.3-6.6.8C28.8 14.8 38.7 8.5 50 8.5c22.9 0 41.5 18.6 41.5 41.5 0 8.4-2.5 16.2-6.8 22.8 5.8-6.3 9.3-14.7 9.3-23.9 0-24.8-20-44.9-44-44.9z"
            fill="url(#nagadGrad1)"
          />
          {/* Inner fiery swoosh */}
          <path
            d="M62 48c-7.2 0-13.8 3.6-17.7 9.5-4.2 6.4-4.6 14.5-1.1 21.3 4.2 8.2 12.6 13.2 21.8 13.2 14.9 0 27-12.1 27-27 0-4.1-1-8-2.6-11.4-2.8-5.8-8.7-9.6-15.4-9.6-4 0-7.8 1.4-10.8 3.8 3.2-1.2 6.7-1.8 10.3-1.8 11.6 0 21 9.4 21 21 0 7.8-4.3 14.7-10.7 18.2-1.9-4.2-2.1-9-.6-13.5 2.1-6.4 7.3-10.9 13.7-11.7C90 53.6 77 48 62 48z"
            fill="url(#nagadGrad2)"
          />
        </>
      )}
    </g>
  </svg>
);

/**
 * Clean Branded bKash Badge with Official Logo + Wordmark
 */
export const BkashBrandBadge: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-[#E2136E] text-white rounded-lg shadow-2xs select-none">
    <BkashIcon className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
    <span className="font-bold tracking-tight text-xs">bKash</span>
  </div>
);

/**
 * Clean Branded Nagad Badge with Official Logo + Wordmark
 */
export const NagadBrandBadge: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-gradient-to-r from-[#F7941D] to-[#ED1C24] text-white rounded-lg shadow-2xs select-none">
    <NagadIcon className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
    <span className="font-bold tracking-tight text-xs">Nagad</span>
  </div>
);
