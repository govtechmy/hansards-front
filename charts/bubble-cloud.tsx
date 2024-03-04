import { cn } from "@lib/helpers";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import { useTheme } from "next-themes";
import { useMemo } from "react";

interface BubbleCloudProps {
  className?: string;
  data: Array<{ id: string; value: number }>;
}

const BubbleCloud = ({ className, data }: BubbleCloudProps) => {
  const { theme } = useTheme();
  const _data = useMemo(() => {
    let chart_data = {
      id: "root",
      children: data,
    };
    return chart_data;
  }, [data]);

  return (
    <>
      <div className={cn(className)}>
        <ResponsiveCirclePacking
          data={_data}
          colors={(data) => {
            if (data.radius > 100) return "#DDD6B0";
            if (data.radius > 60) return "#E4DFC3";
            if (data.radius > 40) return "#EBE8D6";
            if (data.radius > 25) return "#F1F1E9";
            else return "#FAFAF3";
          }}
          padding={4}
          leavesOnly
          enableLabels
          label="id"
          labelComponent={({ label, node }) => (
            <>
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                  fontWeight: 600,
                  pointerEvents: "none",
                }}
                fill="#000"
                stroke="#fff"
                strokeWidth={theme === "dark" ?
                  node.radius > 100
                    ? "1px"
                    : node.radius > 60
                      ? "0.6px"
                      : node.radius > 40
                        ? "0.4px"
                        : node.radius > 30
                          ? "0.3px"
                          : node.radius > 25
                            ? "0.25px"
                            : "0.2px"
                  : 0
                }
                className={cn(
                  "font-header",
                  node.radius > 100
                    ? "text-[32px]"
                    : node.radius > 60
                      ? "text-[22px]"
                      : node.radius > 40
                        ? "text-[18px]"
                        : node.radius > 35
                          ? "text-[16px]"
                          : node.radius > 30
                            ? "text-[12px]"
                            : node.radius > 25
                              ? "text-[10px]"
                              : node.radius > 20
                                ? "text-[9px]"
                                : "text-[8px]"
                )}
              >
                {label}
              </text>
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="central"
                dy={
                  node.radius > 100
                    ? 32
                    : node.radius > 60
                      ? 24
                      : node.radius > 40
                        ? 20
                        : node.radius > 30
                          ? 16
                          : node.radius > 25
                            ? 12
                            : 10
                }
                className={cn(
                  node.radius > 100
                    ? "text-[16px]"
                    : node.radius > 60
                      ? "text-[12px]"
                      : node.radius > 40
                        ? "text-[10px]"
                        : node.radius > 30
                          ? "text-[9px]"
                          : node.radius > 25
                            ? "text-[8px]"
                            : "text-[6px]"
                )}
                fill="#71717A"
              >
                {node.value}
              </text>
            </>
          )}
          tooltip={({ color, data, value }) => (
            <div className="flex min-w-max items-center justify-center rounded bg-zinc-900 py-[5px] px-[9px] text-sm text-white animate-appear">
              <span
                className="w-4 h-4 mr-1.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              {`${data.id}: ${value}`}
            </div>
          )}
          animate={false}
        />
      </div>
    </>
  );
};

export default BubbleCloud;
