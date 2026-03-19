/**
 * Inline treemap mark for crisp rendering at any size.
 * Keep geometry in sync with public/icon.svg (favicon script reads that file).
 */
export function TreemapBrandMark({
  className,
  "aria-hidden": ariaHidden = true,
}: {
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
      aria-hidden={ariaHidden}
    >
      <rect
        x="4"
        y="4"
        width="10"
        height="24"
        rx="2"
        fill="#C49A5C"
        stroke="#D3D7DD"
        strokeOpacity="0.95"
        strokeWidth="0.75"
      />
      <rect
        x="15"
        y="4"
        width="13"
        height="9"
        rx="2"
        fill="#5E9E74"
        stroke="#D3D7DD"
        strokeOpacity="0.95"
        strokeWidth="0.75"
      />
      <rect
        x="15"
        y="14"
        width="6"
        height="14"
        rx="2"
        fill="#4E9999"
        stroke="#D3D7DD"
        strokeOpacity="0.95"
        strokeWidth="0.75"
      />
      <rect
        x="22"
        y="14"
        width="6"
        height="14"
        rx="2"
        fill="#B86B6B"
        stroke="#D3D7DD"
        strokeOpacity="0.95"
        strokeWidth="0.75"
      />
    </svg>
  );
}
