"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateSection } from "@/app/admin/actions";
import type { FieldConfig, SectionKey } from "@/lib/admin-tables";
import { Label } from "@/components/ui/label";
import { Input, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/image-upload";

export function SectionForm({
  sectionKey,
  fields,
  initialContent,
  initialVisible,
}: {
  sectionKey: SectionKey;
  fields: FieldConfig[];
  initialContent: Record<string, unknown>;
  initialVisible: boolean;
}) {
  const [content, setContent] = useState(initialContent);
  const [visible, setVisible] = useState(initialVisible);
  const [pending, startTransition] = useTransition();

  function setField(key: string, value: unknown) {
    setContent((prev) => ({ ...prev, [key]: value }));
  }

  function onSave() {
    startTransition(async () => {
      try {
        await updateSection(sectionKey, content, visible);
        toast.success("Збережено");
      } catch {
        toast.error("Не вдалося зберегти");
      }
    });
  }

  return (
    <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6">
      <div className="flex items-center justify-between rounded-xl bg-pink-light/60 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-navy">Показувати секцію на сайті</p>
          <p className="text-xs text-navy/60">Вимкніть, щоб приховати блок без видалення даних</p>
        </div>
        <Switch checked={visible} onCheckedChange={setVisible} />
      </div>

      {fields.map((field) => (
        <div key={field.key}>
          <Label>{field.label}</Label>
          {field.type === "textarea" && (
            <Textarea
              value={(content[field.key] as string) ?? ""}
              onChange={(e) => setField(field.key, e.target.value)}
              rows={3}
            />
          )}
          {field.type === "text" && (
            <Input
              value={(content[field.key] as string) ?? ""}
              onChange={(e) => setField(field.key, e.target.value)}
            />
          )}
          {field.type === "image" && (
            <ImageUpload
              value={(content[field.key] as string) ?? ""}
              onChange={(url) => setField(field.key, url)}
            />
          )}
          {field.type === "string-list" && (
            <Textarea
              value={((content[field.key] as string[]) ?? []).join("\n")}
              onChange={(e) =>
                setField(
                  field.key,
                  e.target.value.split("\n").map((v) => v.trim()).filter(Boolean)
                )
              }
              rows={4}
            />
          )}
        </div>
      ))}

      {fields.length === 0 && (
        <p className="text-sm text-navy/50">У цієї секції немає текстових полів для редагування.</p>
      )}

      <Button onClick={onSave} disabled={pending}>
        {pending ? "Зберігаємо…" : "Зберегти зміни"}
      </Button>
    </div>
  );
}
