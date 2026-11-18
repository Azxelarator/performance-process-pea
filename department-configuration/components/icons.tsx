import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Outline({ d, ...props }: IconProps & { d: string }) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

export const SearchIcon = (p: IconProps) => <Outline d="M21 21l-4.5-4.5M18 11a7 7 0 11-14 0 7 7 0 0114 0z" {...p} />;
export const MenuIcon = (p: IconProps) => <Outline d="M4 6h16M4 12h16M4 18h16" {...p} />;
export const CloseIcon = (p: IconProps) => <Outline d="M6 18 18 6M6 6l12 12" {...p} />;
export const ArrowRightIcon = (p: IconProps) => <Outline d="M5 12h14m-6-6 6 6-6 6" {...p} />;
export const ChevronLeftIcon = (p: IconProps) => <Outline d="M15 19l-7-7 7-7" {...p} />;
export const ChevronRightIcon = (p: IconProps) => <Outline d="M9 5l7 7-7 7" {...p} />;
export const ChevronDownIcon = (p: IconProps) => <Outline d="M6 9l6 6 6-6" {...p} />;
export const DownloadIcon = (p: IconProps) => <Outline d="M12 4v11M7 10l5 5 5-5M5 20h14" {...p} />;
export const MapPinIcon = (p: IconProps) => <Outline d="M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11zm0-8.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" {...p} />;
export const PhoneIcon = (p: IconProps) => <Outline d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2" {...p} />;
export const MailIcon = (p: IconProps) => <Outline d="M3 7l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" {...p} />;
export const ClockIcon = (p: IconProps) => <Outline d="M12 7v5l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" {...p} />;
export const UserIcon = (p: IconProps) => <Outline d="M16 8a4 4 0 11-8 0 4 4 0 018 0zM4 21c0-4 3.6-7 8-7s8 3 8 7" {...p} />;
export const PencilIcon = (p: IconProps) => <Outline d="M15.2 5.2l3.6 3.6M4 20h4L19 9a2.5 2.5 0 00-3.6-3.6L4 16.4V20z" {...p} />;
export const TrashIcon = (p: IconProps) => <Outline d="M19 7l-.9 12.1A2 2 0 0116.1 21H7.9a2 2 0 01-2-1.9L5 7m5 4v6m4-6v6M15 7V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" {...p} />;
export const ArrowUpIcon = (p: IconProps) => <Outline d="M12 19V5m-6 6 6-6 6 6" {...p} />;
export const ArrowDownIcon = (p: IconProps) => <Outline d="M12 5v14m6-6-6 6-6-6" {...p} />;
export const LayersIcon = (p: IconProps) => <Outline d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5" {...p} />;
export const DatabaseIcon = (p: IconProps) => <Outline d="M5 6c0 1.7 3.1 3 7 3s7-1.3 7-3-3.1-3-7-3-7 1.3-7 3zm0 0v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" {...p} />;
export const ChartIcon = (p: IconProps) => <Outline d="M4 20V10M10 20V4M16 20v-7M22 20H2" {...p} />;
export const MapIcon = (p: IconProps) => <Outline d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" {...p} />;
export const MegaphoneIcon = (p: IconProps) => <Outline d="M3 11v2a1 1 0 001 1h2l5 4V6L6 10H4a1 1 0 00-1 1zm13-3a5 5 0 010 8m3-11a9 9 0 010 14" {...p} />;
