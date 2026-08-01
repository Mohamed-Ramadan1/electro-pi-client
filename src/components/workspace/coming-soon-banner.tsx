import { Construction } from "lucide-react";

export function ComingSoonBanner() {
  return (
    <div className="border-b border-amber-500/20 bg-amber-500/5 px-6 py-2.5">
      <div className="flex items-center justify-center gap-2">
        <Construction className="size-3.5 text-amber-500" />
        <span className="text-[12px] font-medium text-amber-600 tracking-wide">
          Coming Soon
        </span>
      </div>
    </div>
  );
}
