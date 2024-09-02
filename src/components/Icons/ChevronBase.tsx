export function IcChevron(props: Readonly<React.SVGProps<SVGSVGElement>>) {
  return (
    <svg version="1.1" width="6.24805" height="9.53613" {...props}>
      <g>
        <rect height="9.53613" opacity="0" width="6.24805" x="0" y="0" />
        <path
          d="M6.24805 4.76465C6.24805 4.61426 6.19336 4.47754 6.07715 4.36133L1.85254 0.164062C1.75 0.0546875 1.61328 0 1.45605 0C1.13477 0 0.888672 0.239258 0.888672 0.560547C0.888672 0.710938 0.957031 0.854492 1.05273 0.963867L4.87402 4.76465L1.05273 8.56543C0.957031 8.6748 0.888672 8.81152 0.888672 8.96875C0.888672 9.29004 1.13477 9.5293 1.45605 9.5293C1.61328 9.5293 1.75 9.47461 1.85254 9.36523L6.07715 5.16797C6.19336 5.05176 6.24805 4.91504 6.24805 4.76465Z"
          fill={props.fill}
          fillOpacity="1"
        />
      </g>
    </svg>
  );
}