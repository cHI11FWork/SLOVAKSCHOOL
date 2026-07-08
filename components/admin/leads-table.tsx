"use client";

import { useMemo, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { updateLeadStatus, deleteLead } from "@/app/admin/actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { LeadRow, LeadStatus } from "@/lib/types";

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "Новий",
  in_progress: "В обробці",
  done: "Оброблено",
};

const SOURCE_LABEL: Record<string, string> = {
  hero_form: "Головна форма",
  consultation_form: "Консультація",
  feedback_form: "Форма зв'язку",
};

export function LeadsTable({ leads }: { leads: LeadRow[] }) {
  const [items, setItems] = useState(leads);
  const [query, setQuery] = useState("");
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (l) => l.name.toLowerCase().includes(q) || l.phone.toLowerCase().includes(q)
    );
  }, [items, query]);

  function onStatusChange(id: string, status: LeadStatus) {
    setItems((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    startTransition(async () => {
      try {
        await updateLeadStatus(id, status);
      } catch {
        toast.error("Не вдалося оновити статус");
      }
    });
  }

  function onDelete(id: string) {
    const prev = items;
    setItems((p) => p.filter((l) => l.id !== id));
    startTransition(async () => {
      try {
        await deleteLead(id);
        toast.success("Заявку видалено");
      } catch {
        setItems(prev);
        toast.error("Не вдалося видалити заявку");
      }
    });
  }

  return (
    <div>
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Пошук за ім'ям або телефоном…"
          className="pl-9"
        />
      </div>

      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ім&rsquo;я</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead>Джерело</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence initial={false}>
              {filtered.map((lead) => (
                <motion.tr
                  key={lead.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-b border-gray-100 last:border-0 hover:bg-pink-light/40"
                >
                  <TableCell className="font-medium text-navy">{lead.name}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell className="text-navy/60">{SOURCE_LABEL[lead.source] ?? lead.source}</TableCell>
                  <TableCell className="text-navy/60">
                    {new Date(lead.created_at).toLocaleString("uk-UA")}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={lead.status}
                      onValueChange={(v) => onStatusChange(lead.id, v as LeadStatus)}
                    >
                      <SelectTrigger className="h-8 w-[150px]">
                        <SelectValue>
                          <Badge variant={lead.status}>{STATUS_LABEL[lead.status]}</Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(STATUS_LABEL) as LeadStatus[]).map((s) => (
                          <SelectItem key={s} value={s}>
                            {STATUS_LABEL[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(lead.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>

        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-navy/50">Нічого не знайдено.</p>
        )}
      </div>
    </div>
  );
}
