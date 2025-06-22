import type React from "react";

export function VercelLogoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      data-testid="geist-icon"
      height="16"
      strokeLinejoin="round"
      style={{ color: "currentColor" }}
      viewBox="0 0 16 16"
      width="16"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 1L16 15H0L8 1Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}
