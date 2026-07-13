"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { adminLeadSchema, type AdminLeadInput } from "@/lib/validations";
import type { LeadRow } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SOURCE_LABEL: Record<AdminLeadInput["source"], string> = {
  hero_form: "Головна форма",
  consultation_form: "Консультація",
  feedback_form: "Форма зв'язку",
  webinar_form: "Вебінар",
};

const STATUS_LABEL: Record<AdminLeadInput["status"], string> = {
  new: "Новий",
  in_progress: "В обробці",
  done: "Оброблено",
};

const GRADE_LABEL: Record<AdminLeadInput["grade"], string> = {
  "8": "8 клас",
  "9": "9 клас",
  "10": "10 клас",
  "11": "11 клас",
  college: "Коледж",
};

const EMPTY: AdminLeadInput = {
  name: "",
  phone: "",
  grade: "8",
  source: "consultation_form",
  status: "new",
  notes: "",
};

export function LeadFormDialog({
  open,
  onOpenChange,
  lead,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: LeadRow | null;
  onSubmit: (values: AdminLeadInput) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminLeadInput>({
    resolver: zodResolver(adminLeadSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (open) {
      reset(
        lead
          ? {
              name: lead.name,
              phone: lead.phone,
              grade: lead.grade ?? "8",
              source: lead.source,
              status: lead.status,
              notes: lead.notes ?? "",
            }
          : EMPTY
      );
    }
  }, [open, lead, reset]);

  async function submit(values: AdminLeadInput) {
    try {
      await onSubmit(values);
      onOpenChange(false);
    } catch {
      toast.error(lead ? "Не вдалося зберегти зміни" : "Не вдалося додати заявку");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{lead ? "Редагувати заявку" : "Додати заявку"}</DialogTitle>
        <DialogDescription>
          {lead ? "Змініть дані ліда та збережіть." : "Наприклад, лід, отриманий по телефону."}
        </DialogDescription>

        <form onSubmit={handleSubmit(submit)} className="mt-6 flex flex-col gap-4">
          <div>
            <Label>Ім&rsquo;я</Label>
            <Input className="mt-1.5" placeholder="Ім'я" {...register("name")} />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <Label>Телефон</Label>
            <Input className="mt-1.5" placeholder="Номер телефону" type="tel" {...register("phone")} />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Клас/курс</Label>
              <Controller
                control={control}
                name="grade"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1.5 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(GRADE_LABEL) as AdminLeadInput["grade"][]).map((g) => (
                        <SelectItem key={g} value={g}>
                          {GRADE_LABEL[g]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label>Джерело</Label>
              <Controller
                control={control}
                name="source"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1.5 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(SOURCE_LABEL) as AdminLeadInput["source"][]).map((s) => (
                        <SelectItem key={s} value={s}>
                          {SOURCE_LABEL[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label>Статус</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1.5 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(STATUS_LABEL) as AdminLeadInput["status"][]).map((s) => (
                        <SelectItem key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div>
            <Label>Нотатки</Label>
            <Textarea
              className="mt-1.5"
              placeholder="Коментар менеджера…"
              {...register("notes")}
            />
            {errors.notes && <p className="mt-1 text-xs text-red-500">{errors.notes.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting} className="mt-2">
            {isSubmitting ? "Зберігаємо…" : lead ? "Зберегти" : "Додати"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
