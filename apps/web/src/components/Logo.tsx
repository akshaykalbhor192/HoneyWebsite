import { site } from "@/config/site";

// Placeholder wordmark. Replace with the real logo later.
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className="display text-[1.7rem] leading-none">{site.name}</span>
      <span className="font-deva text-xs opacity-70">{site.sanskrit}</span>
    </span>
  );
}
