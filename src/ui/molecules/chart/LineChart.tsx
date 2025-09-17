import { colors } from "@/lib/utils/colors";

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface LineChartProps {
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  className?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
}

export const LineChart = ({
  data,
  title,
  height = 300,
  className = "",
  showGrid = true,
  showTooltip = true,
}: LineChartProps) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  const chartWidth = 800;
  const chartHeight = height - 100; // Leave space for labels
  const padding = 60;

  // Calculate points for the line
  const points = data.map((point, index) => {
    const x =
      padding + (index * (chartWidth - 2 * padding)) / (data.length - 1);
    const y =
      chartHeight -
      padding -
      ((point.value - minValue) / range) * (chartHeight - 2 * padding);
    return { x, y, ...point };
  });

  // Generate path for the line
  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? "M" : "L";
    return `${path} ${command} ${point.x} ${point.y}`;
  }, "");

  // Generate area path (fill under the line)
  const areaPath = `${pathData} L ${points[points.length - 1].x} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`;

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
      )}
      <div className="relative">
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="overflow-visible"
        >
          {/* Define gradients */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: colors.primary[500], stopOpacity: 0.3 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: colors.primary[500], stopOpacity: 0.05 }}
              />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: colors.primary[400] }} />
              <stop offset="50%" style={{ stopColor: colors.primary[500] }} />
              <stop offset="100%" style={{ stopColor: colors.primary[600] }} />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {showGrid && (
            <g>
              {/* Horizontal grid lines */}
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((ratio, index) => {
                const y =
                  chartHeight - padding - ratio * (chartHeight - 2 * padding);
                return (
                  <line
                    key={index}
                    x1={padding}
                    y1={y}
                    x2={chartWidth - padding}
                    y2={y}
                    stroke={colors.neutral[200]}
                    strokeWidth="1"
                  />
                );
              })}
              {/* Vertical grid lines */}
              {points.map((point, index) => (
                <line
                  key={index}
                  x1={point.x}
                  y1={padding}
                  x2={point.x}
                  y2={chartHeight - padding}
                  stroke={colors.neutral[200]}
                  strokeWidth="1"
                />
              ))}
            </g>
          )}

          {/* Area under the line */}
          <path d={areaPath} fill="url(#areaGradient)" stroke="none" />

          {/* Main line */}
          <path
            d={pathData}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <g key={index}>
              <rect
                x={point.x - 4}
                y={point.y - 4}
                width="8"
                height="8"
                fill={colors.primary[500]}
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer transition-all hover:scale-125"
                style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
              />
              {/* Highlight for max value */}
              {point.value === maxValue && showTooltip && (
                <g>
                  {/* Tooltip background */}
                  <rect
                    x={point.x - 35}
                    y={point.y - 45}
                    width="70"
                    height="30"
                    rx="6"
                    fill={colors.primary[500]}
                    className="animate-pulse"
                    style={{
                      filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
                    }}
                  />
                  {/* Tooltip arrow */}
                  <polygon
                    points={`${point.x - 4},${point.y - 15} ${point.x + 4},${point.y - 15} ${point.x},${point.y - 8}`}
                    fill={colors.primary[500]}
                  />
                  {/* Tooltip text */}
                  <text
                    x={point.x}
                    y={point.y - 25}
                    textAnchor="middle"
                    className="fill-white text-xs font-bold"
                  >
                    {point.value.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </text>
                </g>
              )}
            </g>
          ))}

          {/* X-axis labels */}
          {points.map((point, index) => (
            <text
              key={index}
              x={point.x}
              y={chartHeight - padding + 20}
              textAnchor="middle"
              className="fill-gray-600 text-xs"
            >
              {point.label}
            </text>
          ))}

          {/* Y-axis labels */}
          {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((ratio, index) => {
            const y =
              chartHeight - padding - ratio * (chartHeight - 2 * padding);
            const percentage = Math.round(ratio * 100);
            return (
              <text
                key={index}
                x={padding - 10}
                y={y + 4}
                textAnchor="end"
                className="fill-gray-600 text-xs"
              >
                {percentage}%
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
