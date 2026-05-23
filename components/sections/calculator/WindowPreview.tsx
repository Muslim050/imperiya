/**
 * Big preview shown in the right-hand panel. Renders the selected variant's
 * photorealistic artwork from public/calculator/ with the chosen dimensions
 * overlaid above and to the right.
 *
 * `narrow` switches to a tighter sizing for tall portrait artwork (doors)
 * so the image doesn't stretch to fill the square container's full height
 * and overwhelm the panel. Window variants (~1:1) keep the original
 * size-full + object-contain behaviour.
 */
export function WindowPreview({
  imageSrc,
  width,
  height,
  alt,
  narrow = false,
}: {
  imageSrc: string;
  width: number;
  height: number;
  alt: string;
  narrow?: boolean;
}) {
  return (
    <div className="relative mx-[18px] mt-[18px] mb-3.5">
      <div className="absolute -top-3 inset-x-0 text-center text-[11px] text-[#777]">
        {width || 0} мм
      </div>
      <div className="absolute top-1/2 -right-[26px] -translate-y-1/2 rotate-[-90deg] text-[11px] text-[#777]">
        {height || 0} мм
      </div>
      <div className="grid aspect-square place-items-center bg-[linear-gradient(180deg,#eef3f6,#dde6ec)] p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={alt}
          className={
            narrow
              ? "block h-auto max-h-[78%] w-auto max-w-[58%] object-contain"
              : "block size-full object-contain"
          }
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}
