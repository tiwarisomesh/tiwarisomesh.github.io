import { EventDisplay } from "@/components/home/event-display";

const fade = "linear-gradient(to bottom, #000 60%, transparent)";

export function MathBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden text-muted"
      style={{ WebkitMaskImage: fade, maskImage: fade }}
    >
      <EventDisplay className="absolute left-1/2 top-[152px] max-w-none -translate-x-1/2 -translate-y-1/2 md:top-[184px]" />
    </div>
  );
}