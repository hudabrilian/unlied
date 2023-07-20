import Link from "next/link";
import { cn } from "~/utils/utils";

interface Props {
  className?: string;
}

export default function TextLogo({ className }: Props) {
  return (
    <Link
      href="/"
      className={cn(
        "select-none text-4xl font-extrabold tracking-tight",
        className
      )}
    >
      Un<span className="text-[hsl(200,100%,70%)]">lied</span>
      <span className="animate-ping text-white duration-1000">.</span>
    </Link>
  );
}
