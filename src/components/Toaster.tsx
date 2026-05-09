import { useToasts } from "@/lib/store";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export function Toaster() {
  const toasts = useToasts((s) => s.toasts);
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className="fade-in-up bg-surface border border-border shadow-lg rounded-lg px-4 py-3 flex items-center gap-3 min-w-[260px]">
          {t.type === "success" && <CheckCircle2 size={18} className="text-gold" />}
          {t.type === "error" && <AlertCircle size={18} className="text-destructive" />}
          {t.type === "info" && <Info size={18} />}
          <p className="text-sm">{t.message}</p>
        </div>
      ))}
    </div>
  );
}
