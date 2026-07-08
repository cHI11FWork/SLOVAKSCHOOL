import { cn } from "@/lib/utils";

/** eslint-disable-next-line @next/next/no-img-element -- static brand SVG, no optimization needed */
export function LogoMark({ className, invert = false }: { className?: string; invert?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.svg"
      alt="VipStudy"
      className={cn("h-auto w-[72px]", invert && "brightness-0 invert", className)}
    />
  );
}
