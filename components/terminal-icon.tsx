import type React from "react";

interface TerminalIconProps {
  className?: string;
  size?: number;
}

export function TerminalIcon({ className, size = 16 }: TerminalIconProps) {
  return (
    <svg
      data-testid="geist-icon"
      height={size}
      width={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.5 2.5H14.5V12.5C14.5 13.0523 14.0523 13.5 13.5 13.5H2.5C1.94772 13.5 1.5 13.0523 1.5 12.5V2.5ZM0 1H1.5H14.5H16V2.5V12.5C16 13.8807 14.8807 15 13.5 15H2.5C1.11929 15 0 13.8807 0 12.5V2.5V1ZM4 11.1339L4.44194 10.6919L6.51516 8.61872C6.85687 8.27701 6.85687 7.72299 6.51517 7.38128L4.44194 5.30806L4 4.86612L3.11612 5.75L3.55806 6.19194L5.36612 8L3.55806 9.80806L3.11612 10.25L4 11.1339ZM8 9.75494H8.6225H11.75H12.3725V10.9999H11.75H8.6225H8V9.75494Z"
        fill="currentColor"
      />
    </svg>
  );
}
