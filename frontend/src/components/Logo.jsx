import React from 'react';

export default function Logo({ className = '' }) {
  // Simple elegant monogram 'A' logo using currentColor so Tailwind text color controls it
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="64" height="64" rx="8" fill="none" />
      <g fill="currentColor">
        <path d="M32 10 L44 46 H40 L34 28 L30 28 L24 46 H20 L32 10 Z" />
        <circle cx="32" cy="50" r="3" />
      </g>
    </svg>
  );
}
