"use client";

import { useMemo, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2, Pencil, Plus, Download, MessageSquareText } from "lucide-react";
import { toast } from "sonner";
import { updateLeadStatus, deleteLead, createLead, updateLead } from "@/app/admin/actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LeadFormDialog } from "@/components/admin/lead-form-dialog";
import type { AdminLeadInput } from "@/lib/validations";
import type { LeadRow, LeadStatus, LeadSource } from "@/lib/types";

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

function toCsv(rows: LeadRow[]) {
  const header = ["Ім'я", "Телефон", "Джерело", "Статус", "Нотатки", "Дата"];
  const lines = rows.map((l) =>
    [
      l.name,
      l.phone,
      SOURCE_LABEL[l.source] ?? l.source,
      STATUS_LABEL[l.status],
      l.notes ?? "",
      new Date(l.created_at).toLocaleString("uk-UA"),
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  return ["﻿" + header.join(","), ...lines].join("\n");
}

export function LeadsTable({ leads }: { leads: LeadRow[] }) {
  const [items, setItems] = useState(leads);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<LeadRow | null>(null);
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (sourceFilter !== "all" && l.source !== sourceFilter) return false;
      if (q && !l.name.toLowerCase().includes(q) && !l.phone.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, query, statusFilter, sourceFilter]);

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

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(lead: LeadRow) {
    setEditing(lead);
    setDialogOpen(true);
  }

  async function onSubmitDialog(values: AdminLeadInput) {
    if (editing) {
      await updateLead(editing.id, values);
      setItems((prev) =>
        prev.map((l) => (l.id === editing.id ? { ...l, ...values, notes: values.notes || null } : l))
      );
      toast.success("Заявку оновлено");
    } else {
      const created = await createLead(values);
      setItems((prev) => [created as LeadRow, ...prev]);
      toast.success("Заявку додано");
    }
  }

  function exportCsv() {
    const blob = new Blob([toCsv(filtered)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Пошук за ім'ям або телефоном…"
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as LeadStatus | "all")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Усі статуси</SelectItem>
            {(Object.keys(STATUS_LABEL) as LeadStatus[]).map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v as LeadSource | "all")}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Джерело" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Усі джерела</SelectItem>
            {Object.entries(SOURCE_LABEL).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={exportCsv}>
            <Download className="h-4 w-4" />
            CSV
          </Button>
          <Button type="button" size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Додати заявку
          </Button>
        </div>
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
                  <TableCell className="font-medium text-navy">
                    <div className="flex items-center gap-1.5">
                      {lead.name}
                      {lead.notes && (
                        <MessageSquareText
                          className="h-3.5 w-3.5 shrink-0 text-navy/40"
                          aria-label="Є нотатки"
                        />
                      )}
                    </div>
                  </TableCell>
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
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(lead)}>
                        <Pencil className="h-4 w-4 text-navy/60" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(lead.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
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

      <LeadFormDialog open={dialogOpen} onOpenChange={setDialogOpen} lead={editing} onSubmit={onSubmitDialog} />
    </div>
  );
}
