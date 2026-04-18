import { Badge } from "@/components/ui/badge";

export function SimplePage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
      <Badge>{title}</Badge>
      <h1 className="mt-4 text-3xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-3 max-w-3xl text-slate-600">{description}</p>
    </div>
  );
}
