import { type SVGProps, useId } from 'react'

export function HsrBackground(props: SVGProps<SVGSVGElement>) {
  const id = useId().replace(/:/g, '')
  const clipId = `hsr-bg-clip-${id}`
  const mask0Id = `hsr-bg-mask-0-${id}`
  const mask1Id = `hsr-bg-mask-1-${id}`
  const mask2Id = `hsr-bg-mask-2-${id}`
  const paint0Id = `hsr-bg-paint-0-${id}`

  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="74"
      viewBox="0 0 360 74"
      width="360"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M263.23 68.28H399.108V42.0254H306.817C301.815 42.0254 296.822 42.6188 292.048 44.1096C282.668 47.0383 267.056 52.7627 263.23 59.3998C257.665 69.0522 263.23 68.28 263.23 68.28Z"
          fill="#F5F5F5"
        />
        <path
          d="M367.585 42.0254H312.419L335.002 67.4191H367.585V42.0254Z"
          fill="#F6F9FC"
          opacity="0.56"
        />
        <mask
          height="27"
          id={mask0Id}
          maskUnits="userSpaceOnUse"
          style={{ maskType: 'alpha' }}
          width="140"
          x="260"
          y="42"
        >
          <path
            d="M263.23 68.38H399.108V42.0254H306.845C301.824 42.0254 296.814 42.6229 292.024 44.125C282.641 47.0672 267.053 52.8093 263.23 59.466C257.665 69.1552 263.23 68.38 263.23 68.38Z"
            fill="white"
          />
        </mask>
        <g mask={`url(#${mask0Id})`}>
          <path
            d="M272.577 52.1078C283.961 55.9857 300.598 49.0055 302.787 46.6788C304.874 44.4605 301.68 42.3077 298.673 42.7967C284.25 45.1425 264.463 49.3435 272.577 52.1078Z"
            fill="#73CAF6"
          />
        </g>
        <path
          d="M399.108 55.1606H314.01C305.236 55.1606 296.628 57.5576 289.117 62.0926L277.394 69.1709H292.28L303.663 62.9441H399.108V55.1606Z"
          fill="#73CAF6"
        />
        <path
          d="M386 55.1606L324.1 55.1608L327.213 58.6634L386 58.6632V55.1606Z"
          fill="#3CB1EC"
        />
        <mask
          height="27"
          id={mask1Id}
          maskUnits="userSpaceOnUse"
          style={{ maskType: 'alpha' }}
          width="140"
          x="260"
          y="42"
        >
          <path
            d="M263.23 68.38H399.108V42.0254H306.845C301.824 42.0254 296.814 42.6229 292.024 44.125C282.641 47.0672 267.053 52.8093 263.23 59.466C257.665 69.1552 263.23 68.38 263.23 68.38Z"
            fill="white"
          />
        </mask>
        <g mask={`url(#${mask1Id})`}>
          <path
            d="M284.361 68.2952C284.361 67.2159 284.404 64.7783 287.526 64.1796C290.647 63.581 367.569 63.9302 395.605 64.1796V58.7078C395.605 58.7078 339.842 58.6072 304.189 58.7078C290.711 58.7458 278.355 58.6456 274.723 58.9417C261.487 60.0209 259.88 68.2952 259.88 68.2952H284.361Z"
            fill="#FFDE8B"
          />
        </g>
        <path
          d="M382 58.6626C360.606 58.6626 348.611 58.6626 327.217 58.6626L331.877 63.9165H382V58.6626Z"
          fill="#FFD364"
        />
        <rect
          fill="#A8A8A8"
          height="2"
          rx="1"
          transform="matrix(-1 0 0 1 385 67)"
          width="124"
        />
        <mask
          height="12"
          id={mask2Id}
          maskUnits="userSpaceOnUse"
          style={{ maskType: 'alpha' }}
          width="32"
          x="272"
          y="42"
        >
          <path
            clipRule="evenodd"
            d="M302.787 46.679C304.874 44.4607 301.679 42.3082 298.673 42.7971C297.041 43.0625 295.342 43.3533 293.621 43.6614C293.086 43.8058 292.553 43.9592 292.023 44.1253C286.402 45.8879 278.555 48.6558 272.344 52.0227C272.419 52.0505 272.496 52.0801 272.577 52.1077C283.96 55.9855 300.598 49.0057 302.787 46.679Z"
            fill="white"
            fillRule="evenodd"
          />
        </mask>
        <g mask={`url(#${mask2Id})`}>
          <rect
            fill="#3CB1EC"
            height="7.00515"
            transform="matrix(-0.946425 0.322925 0.322925 0.946425 314.535 41.1499)"
            width="39.404"
          />
        </g>
        <rect
          fill="#A6DDF8"
          height="5.25386"
          rx="0.875644"
          transform="matrix(-1 0 0 1 346.569 46.4043)"
          width="3.50257"
        />
        <rect
          fill="#A6DDF8"
          height="5.25386"
          rx="0.875644"
          transform="matrix(-1 0 0 1 332.559 46.4043)"
          width="3.50257"
        />
        <rect
          fill="#A6DDF8"
          height="5.25386"
          rx="0.875644"
          transform="matrix(-1 0 0 1 318.549 46.4043)"
          width="3.50257"
        />
        <rect
          fill={`url(#${paint0Id})`}
          fillOpacity="0.2"
          height="54"
          width="374"
        />
        <path
          d="M341.92 18.4601C341.92 20.3711 340.371 21.9203 338.46 21.9203C336.549 21.9203 335 20.3711 335 18.4601C335 16.5492 336.549 15 338.46 15C340.371 15 341.92 16.5492 341.92 18.4601Z"
          fill="#FCD7D9"
        />
        <path
          d="M362 38.5C362 39.8807 360.881 41 359.5 41C358.119 41 357 39.8807 357 38.5C357 37.1193 358.119 36 359.5 36C360.881 36 362 37.1193 362 38.5Z"
          fill="#FCD7D9"
        />
        <path
          d="M255.293 29.9371L257.898 32.5197L265.594 26.3421L261.093 22L255.293 29.9371Z"
          fill="#FCD7D9"
        />
        <path
          d="M210.895 21.311L213.143 19.4148L209.797 14.0001L206 17.2752L210.895 21.311Z"
          fill="#FCD7D9"
        />
        <path
          d="M228.141 36.2653L228.39 39.6274L235.666 40.1616L235.179 34.434L228.141 36.2653Z"
          fill="#FFE8E9"
        />
        <path
          d="M310.273 29.3201L312.96 27.2834L309.544 21L305 24.5218L310.273 29.3201Z"
          fill="#FFE8E9"
        />
      </g>
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={paint0Id}
          x1="187"
          x2="187"
          y1="0"
          y2="54"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <clipPath id={clipId}>
          <rect fill="white" height="74" width="360" />
        </clipPath>
      </defs>
    </svg>
  )
}
