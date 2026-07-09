"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, MessageSquareText } from "lucide-react";
import { toast } from "sonner";
import { deleteLead, updateLead } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LeadFormDialog } from "@/components/admin/lead-form-dialog";
import type { AdminLeadInput } from "@/lib/validations";
import type { LeadRow, LeadStatus } from "@/lib/types";

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "Новий",
  in_progress: "В обробці",
  done: "Оброблено",
};

export function RecentLeadsList({ leads }: { leads: LeadRow[] }) {
  const router = useRouter();
  const [items, setItems] = useState(leads);
  const [editing, setEditing] = useState<LeadRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [, startTransition] = useTransition();

  function onDelete(id: string) {
    const prev = items;
    setItems((p) => p.filter((l) => l.id !== id));
    startTransition(async () => {
      try {
        await deleteLead(id);
        toast.success("Заявку видалено");
        router.refresh();
      } catch {
        setItems(prev);
        toast.error("Не вдалося видалити заявку");
      }
    });
  }

  function openEdit(lead: LeadRow) {
    setEditing(lead);
    setDialogOpen(true);
  }

  async function onSubmitDialog(values: AdminLeadInput) {
    if (!editing) return;
    await updateLead(editing.id, values);
    setItems((prev) =>
      prev.map((l) => (l.id === editing.id ? { ...l, ...values, notes: values.notes || null } : l))
    );
    toast.success("Заявку оновлено");
    router.refresh();
  }

  if (items.length === 0) {
    return <p className="py-6 text-sm text-navy/50">Заявок ще немає.</p>;
  }

  return (
    <>
      <div className="divide-y divide-gray-100">
        <AnimatePresence initial={false}>
          {items.map((lead, i) => (
            <motion.div
              key={lead.id}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="shrink-0 text-xs text-navy/40">№{lead.lead_number}</span>
                  <p className="truncate font-medium text-navy">{lead.name}</p>
                  {lead.notes && (
                    <MessageSquareText
                      className="h-3.5 w-3.5 shrink-0 text-navy/40"
                      aria-label="Є нотатки"
                    />
                  )}
                </div>
                <p className="text-sm text-navy/60">{lead.phone}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Badge variant={lead.status}>{STATUS_LABEL[lead.status]}</Badge>
                <Button variant="ghost" size="icon" onClick={() => openEdit(lead)}>
                  <Pencil className="h-4 w-4 text-navy/60" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(lead.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <LeadFormDialog open={dialogOpen} onOpenChange={setDialogOpen} lead={editing} onSubmit={onSubmitDialog} />
    </>
  );
}
