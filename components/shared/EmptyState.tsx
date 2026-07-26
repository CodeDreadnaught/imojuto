import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
      <Icon className="h-8 w-8 text-emerald-800" aria-hidden="true" />
      <h2 className="mt-4 text-base font-semibold text-stone-950">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-stone-600">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
