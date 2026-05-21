import type { Shape } from "@/data/calculator";

/** Reproduces the design's .preview-window, reflecting shape/size/color. */
export function WindowPreview({
  shape,
  width,
  height,
  color,
}: {
  shape: Shape;
  width: number;
  height: number;
  color: string;
}) {
  const leaves =
    shape === "single"
      ? 1
      : shape === "double" || shape === "balcony"
        ? 2
        : shape === "triple"
          ? 3
          : 4;
  const frame = color === "#ffffff" || color === "#fff" ? "#232323" : color;

  return (
    <div className="relative mx-[18px] mt-[18px] mb-3.5">
      <div className="absolute -top-3 inset-x-0 text-center text-[11px] text-[#777]">
        {width || 0} мм
      </div>
      <div className="absolute top-1/2 -right-[26px] -translate-y-1/2 rotate-[-90deg] text-[11px] text-[#777]">
        {height || 0} мм
      </div>
      <div
        className="relative grid aspect-square gap-1.5 p-1.5"
        style={{
          border: `6px solid ${frame}`,
          background: "linear-gradient(180deg,#bcd0db,#7fa0b3)",
          gridTemplateColumns: `repeat(${leaves}, minmax(0,1fr))`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-1.5"
          style={{ border: "2px solid #2a2a2a" }}
        />
        {Array.from({ length: leaves }).map((_, i) => (
          <div
            key={i}
            className="relative"
            style={{
              background:
                "linear-gradient(180deg,#a8c4d2 0%,#7497ad 50%,#3d5468 100%)",
            }}
          >
            <span
              className="absolute"
              style={{
                left: "8%",
                right: "8%",
                top: "8%",
                bottom: "60%",
                background:
                  "linear-gradient(120deg,rgba(255,255,255,.55),rgba(255,255,255,0))",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
