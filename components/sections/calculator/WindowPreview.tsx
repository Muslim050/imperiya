/**
 * Big window preview shown in the right-hand panel. Renders the selected
 * variant's photorealistic SVG from public/calculator/ with the chosen
 * dimensions overlaid above and to the right.
 */
export function WindowPreview({
  imageSrc,
  width,
  height,
  alt,
}: {
  imageSrc: string;
  width: number;
  height: number;
  alt: string;
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
          className="block size-full object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}
