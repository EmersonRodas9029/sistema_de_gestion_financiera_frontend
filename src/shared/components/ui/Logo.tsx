import { useId } from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo = ({ size = 40, className = '' }: LogoProps) => {
  const gradientId = `logo-gradient-${useId()}`;

  return (
  <svg
    width={size}
    height={size}
    viewBox="0 0 60 60"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8A5CF6" />
        <stop offset="100%" stopColor="#F26D5B" />
      </linearGradient>
    </defs>
    <rect width="60" height="60" rx="16" fill={`url(#${gradientId})`} />
    <rect x="14" y="32" width="9" height="18" rx="3" fill="#fff" opacity="0.92" />
    <rect x="27" y="22" width="9" height="28" rx="3" fill="#fff" opacity="0.96" />
    <rect x="40" y="10" width="9" height="40" rx="3" fill="#fff" />
    <path
      d="M14 28 L27 18 L40 6"
      stroke="#fff"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.85"
    />
    <path
      d="M34 6 L40 6 L40 12"
      stroke="#fff"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.85"
    />
  </svg>
  );
};
