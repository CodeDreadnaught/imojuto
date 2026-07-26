import type { Icon } from "@phosphor-icons/react";
import type * as React from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: Icon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-60 flex-col items-center justify-center rounded-lg border border-dashed border-[#d8cebe] bg-white/75 px-6 py-12 text-center shadow-sm",
        className,
      )}
    >
      <span className="grid h-12 w-12 place-items-center rounded-md bg-[#e6f0ea] text-[#1d4f43]">
        <Icon className="h-6 w-6" weight="duotone" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-base font-semibold text-[#27241f]">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-[#655c50]">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
