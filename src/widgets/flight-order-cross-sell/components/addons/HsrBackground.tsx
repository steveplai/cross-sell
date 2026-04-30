import { type SVGProps, useId } from 'react'

interface HsrBackgroundProps extends SVGProps<SVGSVGElement> {
  cropRight?: number
}

const backgroundWidth = 227
const backgroundHeight = 66

export function HsrBackground({ cropRight = 0, ...props }: HsrBackgroundProps) {
  const id = useId().replace(/:/g, '')
  const clip0Id = `hsr-bg-clip-0-${id}`
  const clip1Id = `hsr-bg-clip-1-${id}`
  const mask0Id = `hsr-bg-mask-0-${id}`
  const mask1Id = `hsr-bg-mask-1-${id}`
  const mask2Id = `hsr-bg-mask-2-${id}`
  const clippedWidth = backgroundWidth - cropRight

  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={backgroundHeight}
      viewBox={`0 0 ${clippedWidth} ${backgroundHeight}`}
      width={clippedWidth}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath={`url(#${clip0Id})`}>
        <path
          d="M62.9176 64.319H225.972V32.8135H115.222C109.22 32.8135 103.229 33.5255 97.4992 35.3145C86.2429 38.829 67.5095 45.6982 62.9176 53.6627C56.2397 65.2457 62.9176 64.319 62.9176 64.319Z"
          fill="#F5F5F5"
        />
        <path
          d="M226 32.8135L121.945 32.8135L149.044 63.2859L226 63.2859V32.8135Z"
          fill="#F6F9FC"
          opacity="0.56"
        />
        <mask
          height="33"
          id={mask0Id}
          maskUnits="userSpaceOnUse"
          style={{ maskType: 'alpha' }}
          width="167"
          x="59"
          y="32"
        >
          <path
            d="M62.9176 64.439H225.972V32.8135H115.255C109.231 32.8135 103.219 33.5305 97.4704 35.333C86.211 38.8637 67.5056 45.7541 62.9176 53.7422C56.2397 65.3692 62.9176 64.439 62.9176 64.439Z"
            fill="white"
          />
        </mask>
        <g mask={`url(#${mask0Id})`}>
          <path
            d="M74.1348 44.9124C87.7949 49.5658 107.76 41.1896 110.387 38.3976C112.891 35.7356 109.057 33.1523 105.45 33.739C88.1422 36.554 64.3975 41.5953 74.1348 44.9124Z"
            fill="#73CAF6"
          />
        </g>
        <path
          d="M225.972 48.5752H123.854C113.325 48.5752 102.996 51.4515 93.9825 56.8936L79.9143 65.3876H97.7775L111.438 57.9154H225.972V48.5752Z"
          fill="#73CAF6"
        />
        <path
          d="M226 48.5752L135.962 48.5753L139.697 52.7784L226 52.7783V48.5752Z"
          fill="#3CB1EC"
        />
        <mask
          height="33"
          id={mask1Id}
          maskUnits="userSpaceOnUse"
          style={{ maskType: 'alpha' }}
          width="167"
          x="59"
          y="32"
        >
          <path
            d="M62.9177 64.439H225.972V32.8135H115.256C109.231 32.8135 103.219 33.5305 97.4704 35.333C86.211 38.8637 67.5056 45.7541 62.9177 53.7422C56.2397 65.3692 62.9177 64.439 62.9177 64.439Z"
            fill="white"
          />
        </mask>
        <g mask={`url(#${mask1Id})`}>
          <path
            d="M88.2749 64.3373C88.2749 63.0422 88.3266 60.117 92.0725 59.3987C95.8184 58.6803 188.124 59.0993 221.768 59.3987V52.8325C221.768 52.8325 154.853 52.7117 112.069 52.8325C95.8945 52.8781 81.0674 52.7578 76.7099 53.1131C60.8258 54.4082 58.8983 64.3373 58.8983 64.3373H88.2749Z"
            fill="#FFDE8B"
          />
        </g>
        <path
          d="M226 52.7783C200.327 52.7783 165.375 52.7783 139.702 52.7783L145.294 59L226 59.4V52.7783Z"
          fill="#FFD364"
        />
        <path
          d="M226 63H61C60.4477 63 60 63.4477 60 64C60 64.5523 60.4477 65 61 65H226V63Z"
          fill="#A8A8A8"
        />
        <mask
          height="14"
          id={mask2Id}
          maskUnits="userSpaceOnUse"
          style={{ maskType: 'alpha' }}
          width="39"
          x="73"
          y="33"
        >
          <path
            clipRule="evenodd"
            d="M110.386 38.3975C112.89 35.7357 109.057 33.1527 105.449 33.7393C103.495 34.0572 101.459 34.4046 99.3976 34.7735C98.7523 34.9476 98.109 35.1327 97.4699 35.3331C90.7247 37.4482 81.3081 40.7704 73.8546 44.8106C73.9448 44.8439 74.0372 44.8802 74.1339 44.9132C87.794 49.5666 107.759 41.1896 110.386 38.3975Z"
            fill="#8CD0FF"
            fillRule="evenodd"
          />
        </mask>
        <g mask={`url(#${mask2Id})`}>
          <rect
            fill="#3CB1EC"
            height="8.40618"
            transform="matrix(-0.946425 0.322925 0.322925 0.946425 124.483 31.7627)"
            width="47.2848"
          />
        </g>
        <rect
          fill="#A6DDF8"
          height="6.30463"
          rx="1.05077"
          transform="matrix(-1 0 0 1 162.925 38.0679)"
          width="4.20309"
        />
        <rect
          fill="#A6DDF8"
          height="6.30463"
          rx="1.05077"
          transform="matrix(-1 0 0 1 146.112 38.0679)"
          width="4.20309"
        />
        <rect
          fill="#A6DDF8"
          height="6.30463"
          rx="1.05077"
          transform="matrix(-1 0 0 1 129.3 38.0679)"
          width="4.20309"
        />
      </g>
      <g clipPath={`url(#${clip1Id})`}>
        <path
          d="M164.304 6.15216C164.304 8.44533 162.445 10.3043 160.152 10.3043C157.859 10.3043 156 8.44533 156 6.15216C156 3.85899 157.859 2 160.152 2C162.445 2 164.304 3.85899 164.304 6.15216Z"
          fill="#FCD7D9"
        />
        <path
          d="M188.4 28.2002C188.4 29.857 187.057 31.2002 185.4 31.2002C183.743 31.2002 182.4 29.857 182.4 28.2002C182.4 26.5433 183.743 25.2002 185.4 25.2002C187.057 25.2002 188.4 26.5433 188.4 28.2002Z"
          fill="#FCD7D9"
        />
        <path
          d="M60.351 19.9246L63.477 23.0238L72.7133 15.6107L67.3114 10.4L60.351 19.9246Z"
          fill="#FCD7D9"
        />
        <path
          d="M7.07357 9.57323L9.77125 7.29775L5.75652 0.80012L1.19968 4.73027L7.07357 9.57323Z"
          fill="#FCD7D9"
        />
        <path
          d="M27.7685 27.5186L28.0675 31.5531L36.7994 32.1941L36.2141 25.321L27.7685 27.5186Z"
          fill="#FFE8E9"
        />
        <path
          d="M126.327 19.1842L129.551 16.7402L125.452 9.20016L120 13.4262L126.327 19.1842Z"
          fill="#FFE8E9"
        />
      </g>
      <defs>
        <clipPath id={clip0Id}>
          <rect
            fill="white"
            height="32"
            transform="matrix(-1 0 0 1 226 33)"
            width="167"
          />
        </clipPath>
        <clipPath id={clip1Id}>
          <rect
            fill="white"
            height={backgroundHeight}
            width={backgroundWidth}
          />
        </clipPath>
      </defs>
    </svg>
  )
}
