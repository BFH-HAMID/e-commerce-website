'use client'

export function NexoBazarLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={`${className} animate-logo-float`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Blue wavy shape */}
      <g className="animate-logo-pulse">
        {/* Wave outer curves */}
        <path
          d="M 30 45 Q 35 35 45 35 Q 55 35 60 45 L 55 55 Q 50 48 45 48 Q 40 48 35 55 Z"
          fill="url(#blueGradient)"
          opacity="0.8"
        />
        <path
          d="M 35 55 Q 40 48 45 48 Q 50 48 55 55 L 50 65 Q 45 58 40 58 Q 35 58 30 65 Z"
          fill="url(#blueGradient)"
          opacity="0.9"
        />
        <path
          d="M 30 65 Q 35 58 40 58 Q 45 58 50 65 L 45 75 Q 40 68 35 68 Q 30 68 25 75 Z"
          fill="url(#blueGradient)"
        />
      </g>

      {/* Orange arrow */}
      <g className="animate-logo-bounce">
        {/* Arrow shaft */}
        <rect x="55" y="35" width="8" height="45" rx="2" fill="url(#orangeGradient)" />
        {/* Arrow head - top right triangle */}
        <polygon
          points="59,35 75,20 70,35"
          fill="url(#orangeGradient)"
        />
        {/* Arrow head - bottom right triangle */}
        <polygon
          points="63,35 75,20 75,35"
          fill="#FFA500"
          opacity="0.7"
        />
      </g>

      {/* Gradients */}
      <defs>
        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0066FF" />
          <stop offset="100%" stopColor="#004DB3" />
        </linearGradient>
        <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF8C00" />
          <stop offset="100%" stopColor="#FF6B00" />
        </linearGradient>
      </defs>
    </svg>
  )
}
