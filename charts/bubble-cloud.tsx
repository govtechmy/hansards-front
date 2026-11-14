import { cn } from "@lib/helpers";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import { useTheme } from "next-themes";
import { useMemo } from "react";

interface BubbleCloudProps {
  className?: string;
  data: Array<{ id: string; value: number }>;
  /**
   * Bila diberi, setiap gelembung boleh diklik dan menerima perkataan
   * gelembung itu. Bila tiada, gelembung kekal tidak boleh diklik seperti
   * sebelum ini (contohnya di `/cari-mp`, kerana `/cari` tiada penapis author
   * untuk mengekalkan konteks MP).
   */
  onBubbleClick?: (word: string) => void;
}

/**
 * Tangga saiz fon asal, bergantung pada radius sahaja. Dikekalkan sebagai
 * **had atas**, jadi tiada label menjadi lebih besar daripada sebelum ini.
 */
const ladderSize = (r: number) =>
  r > 100
    ? 32
    : r > 60
      ? 22
      : r > 40
        ? 18
        : r > 35
          ? 16
          : r > 30
            ? 12
            : r > 25
              ? 10
              : r > 20
                ? 9
                : 8;

/**
 * Lebar purata satu huruf sebagai pecahan saiz fon, untuk Poppins 600.
 * Ditentukur terhadap 20 perkataan teratas: nilai 0.6 mengenal pasti dengan
 * tepat empat perkataan yang memang melimpah pada paparan sebenar
 * (pembangunan, peruntukan, mengambil, meningkatkan).
 */
const GLYPH_RATIO = 0.6;

/** Pecahan diameter yang teks dibenarkan guna, meninggalkan ruang lega. */
const FIT_RATIO = 0.82;

/** Paras label terkecil yang masih wajar dibaca. */
const MIN_LABEL_SIZE = 9;

/**
 * Saiz fon label yang mengambil kira radius **dan** panjang perkataan.
 *
 * Tangga asal tidak pernah melihat bilangan huruf, jadi perkataan panjang
 * seperti "meningkatkan" melimpah keluar bulatan sementara "harga" berbaki
 * banyak ruang pada saiz fon yang sama.
 *
 * Hasilnya diapit antara `min(tangga, MIN_LABEL_SIZE)` dan nilai tangga itu
 * sendiri. Jadi label tidak pernah lebih besar daripada sebelum ini, dan tidak
 * pernah mengecil melepasi paras terbaca. Pada bulatan yang terlalu kecil untuk
 * memuatkan perkataan panjang secara terbaca, contohnya pada telefon, label
 * kekal seperti hari ini dan masih melimpah sedikit: itu pertukaran yang
 * disengajakan, kerana mengecilkannya lagi hanya menjadikannya tidak terbaca.
 */
const labelFontSize = (radius: number, length: number) => {
  const ladder = ladderSize(radius);
  if (!length) return ladder;
  const fitted = (2 * radius * FIT_RATIO) / (length * GLYPH_RATIO);
  return Math.max(Math.min(ladder, MIN_LABEL_SIZE), Math.min(ladder, fitted));
};

const BubbleCloud = ({ className, data, onBubbleClick }: BubbleCloudProps) => {
  const { resolvedTheme } = useTheme();
  const isClickable = typeof onBubbleClick === "function";
  const _data = useMemo(() => {
    let chart_data = {
      id: "root",
      children: data,
    };
    return chart_data;
  }, [data]);

  return (
    <>
      <div
        className={cn(
          className,
          // Isyarat boleh klik. Label sudah `pointerEvents: "none"`, jadi klik
          // sampai ke bulatan di bawahnya.
          isClickable &&
            "[&_circle:hover]:opacity-75 [&_circle]:cursor-pointer [&_circle]:transition-opacity"
        )}
      >
        <ResponsiveCirclePacking
          data={_data}
          onClick={
            isClickable
              ? node => {
                  // `leavesOnly` menapis paparan, bukan peristiwa, jadi
                  // tolak nod akar supaya klik latar tak mencetus carian.
                  if (node.depth > 0 && node.id) onBubbleClick(node.id);
                }
              : undefined
          }
          colors={data => {
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
          labelComponent={({ label, node }) => {
            // Saiz dikira, bukan kelas Tailwind: Tailwind tidak boleh
            // menghasilkan kelas dinamik seperti `text-[${n}px]`, jadi nilai
            // yang dikira mesti melalui gaya inline.
            const size = labelFontSize(node.radius, String(label).length);
            // Kiraan dan jarak menegak mengikut saiz label supaya nisbahnya
            // kekal seperti tangga asal, contohnya label 32px dengan dy 32.
            const countSize = Math.max(6, size * 0.55);
            return (
              <>
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{
                    fontWeight: 600,
                    pointerEvents: "none",
                    fontSize: `${size}px`,
                  }}
                  fill="#000"
                  stroke="#fff"
                  strokeWidth={
                    resolvedTheme === "dark"
                      ? `${Math.max(0.2, size / 32)}px`
                      : 0
                  }
                  className="font-poppins"
                >
                  {label}
                </text>
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  dy={size * 1.1}
                  style={{
                    pointerEvents: "none",
                    fontSize: `${countSize}px`,
                  }}
                  fill="#71717A"
                >
                  {node.value}
                </text>
              </>
            );
          }}
          tooltip={({ color, data, value }) => (
            <div className="flex min-w-max animate-appear items-center justify-center rounded bg-zinc-900 px-[9px] py-[5px] text-sm text-white">
              <span
                className="mr-1.5 h-4 w-4 rounded-full"
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
