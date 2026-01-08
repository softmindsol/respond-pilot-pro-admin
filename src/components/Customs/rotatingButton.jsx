import { useRef, useEffect, useState } from "react";

const RotatingButton = ({ btnName }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 200, height: 50 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();

    const timer = setTimeout(updateDimensions, 50);

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [btnName]);

  const { width, height } = dimensions;
  const borderRadius = 25;
  const perimeter =
    2 * (width + height - 4 * borderRadius) + 2 * Math.PI * borderRadius;

  const dashLength = perimeter * 0.25;
  const gapLength = perimeter * 0.75;

  return (
    <section className="flex items-center justify-center">
      <div className="flex items-center justify-center">
        <div className="relative" ref={containerRef}>
          {/* Animated border that moves along the path */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={width}
            height={height}
            style={{ overflow: "visible" }}
          >
            <defs>
              <linearGradient
                id="borderGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#FEC36D", stopOpacity: 1 }}
                />
                <stop
                  offset="50%"
                  style={{ stopColor: "#06060610", stopOpacity: 0.1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#D78001", stopOpacity: 1 }}
                />
              </linearGradient>
            </defs>
            <rect
              x="1"
              y="1"
              width={width - 2}
              height={height - 2}
              rx={borderRadius}
              fill="none"
              stroke="url(#borderGradient)"
              strokeWidth="2"
              strokeDasharray={`${dashLength} ${gapLength}`}
              strokeLinecap="round"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to={-perimeter}
                dur="2.5s"
                repeatCount="indefinite"
              />
            </rect>
          </svg>

          {/* Button */}
          <button className="relative rounded-full px-10 py-3.5 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#FEC36D" }}
            ></div>
            <span
              className="text-sm font-medium whitespace-nowrap"
              style={{ color: "#D78001" }}
            >
              {btnName}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default RotatingButton;
