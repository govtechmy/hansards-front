import { cn } from "@lib/helpers";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import { useMemo, useState } from "react";

interface BubbleCloudProps {
  className?: string;
  data: Array<{ id: string; value: number }>;
}

const BubbleCloud = ({ className, data }: BubbleCloudProps) => {
  const [zoomedId, setZoomedId] = useState<string | null>(null);
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
          theme={{ labels: { text: { fontSize: 14 } } }}
          colors={{ scheme: "nivo" }}
          colorBy="id"
          childColor={{
            from: "color",
            modifiers: [["brighter", 0.4]],
          }}
          padding={4}
          leavesOnly
          enableLabels
          label="id"
          labelTextColor={{
            from: "color",
            modifiers: [["darker", 2.4]],
          }}
          borderColor={{
            from: "color",
            modifiers: [["darker", 0.3]],
          }}
          animate={true}
          tooltip={({ color, data, value }) => (
            <div className="flex min-w-max items-center justify-center rounded bg-zinc-900 py-[5px] px-[9px] text-sm text-white animate-appear">
              <span
                className="w-4 h-4 mr-1.5 rounded-full"
                style={{ backgroundColor: color }}
              ></span>
              {`${data.id}: ${value}`}
            </div>
          )}
          zoomedId={zoomedId}
          motionConfig="slow"
          onClick={(node) => {
            setZoomedId(zoomedId === node.id ? null : node.id);
          }}
        />
      </div>
    </>
  );
};

export default BubbleCloud;
