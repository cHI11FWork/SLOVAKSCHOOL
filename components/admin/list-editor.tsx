"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, Trash2, Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { createItem, updateItem, deleteItem, toggleItemVisible, reorderItems } from "@/app/admin/actions";
import type { FieldConfig, ListTableName } from "@/lib/admin-tables";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/admin/image-upload";

type Item = { id: string; visible: boolean; position: number; [key: string]: unknown };

function Field({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: unknown;
  onChange: (v: string) => void;
}) {
  if (field.type === "textarea") {
    return <Textarea value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} rows={2} />;
  }
  if (field.type === "image") {
    return <ImageUpload value={(value as string) ?? ""} onChange={onChange} />;
  }
  return <Input value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} />;
}

function SortableCard({
  item,
  fields,
  onChangeField,
  onSave,
  onDelete,
  onToggleVisible,
  saving,
}: {
  item: Item;
  fields: FieldConfig[];
  onChangeField: (key: string, value: string) => void;
  onSave: () => void;
  onDelete: () => void;
  onToggleVisible: (v: boolean) => void;
  saving: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  return (
    <motion.div
      ref={setNodeRef}
      layout
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`rounded-2xl border bg-white p-5 ${isDragging ? "border-pink shadow-lg" : "border-gray-100"}`}
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab touch-none text-navy/30 hover:text-navy/60 active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="flex-1 space-y-3">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="mb-1 block text-xs font-semibold text-navy/60">{field.label}</label>
              <Field
                field={field}
                value={item[field.key]}
                onChange={(v) => onChangeField(field.key, v)}
              />
            </div>
          ))}
        </div>

        <div className="flex shrink-0 flex-col items-center gap-3">
          <Switch checked={item.visible} onCheckedChange={onToggleVisible} />
          <Button variant="ghost" size="icon" onClick={onSave} disabled={saving}>
            <Save className="h-4 w-4 text-pink" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function ListEditor({
  table,
  fields,
  emptyItem,
  initialItems,
}: {
  table: ListTableName;
  fields: FieldConfig[];
  emptyItem: Record<string, string>;
  initialItems: Item[];
}) {
  const [items, setItems] = useState(initialItems);
  const [pending, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function changeField(id: string, key: string, value: string) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [key]: value } : it)));
  }

  function save(id: string) {
    const item = items.find((it) => it.id === id);
    if (!item) return;
    const data = Object.fromEntries(fields.map((f) => [f.key, item[f.key]]));
    startTransition(async () => {
      try {
        await updateItem(table, id, data);
        toast.success("Збережено");
      } catch {
        toast.error("Не вдалося зберегти");
      }
    });
  }

  function toggleVisible(id: string, visible: boolean) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, visible } : it)));
    startTransition(async () => {
      try {
        await toggleItemVisible(table, id, visible);
      } catch {
        toast.error("Не вдалося змінити видимість");
      }
    });
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
    startTransition(async () => {
      try {
        await deleteItem(table, id);
        toast.success("Видалено");
      } catch {
        toast.error("Не вдалося видалити");
      }
    });
  }

  function addNew() {
    startTransition(async () => {
      try {
        const inserted = await createItem(table, emptyItem);
        setItems((prev) => [...prev, inserted as Item]);
        toast.success("Додано");
      } catch {
        toast.error("Не вдалося додати");
      }
    });
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((it) => it.id === active.id);
      const newIndex = prev.findIndex((it) => it.id === over.id);
      const next = arrayMove(prev, oldIndex, newIndex);
      startTransition(async () => {
        try {
          await reorderItems(table, next.map((it) => it.id));
        } catch {
          toast.error("Не вдалося зберегти порядок");
        }
      });
      return next;
    });
  }

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <SortableCard
                  key={item.id}
                  item={item}
                  fields={fields}
                  onChangeField={(k, v) => changeField(item.id, k, v)}
                  onSave={() => save(item.id)}
                  onDelete={() => remove(item.id)}
                  onToggleVisible={(v) => toggleVisible(item.id, v)}
                  saving={pending}
                />
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>

      {items.length === 0 && (
        <p className="py-10 text-center text-sm text-navy/50">Ще немає елементів.</p>
      )}

      <Button variant="outline" className="mt-4" onClick={addNew} disabled={pending}>
        <Plus className="mr-1.5 h-4 w-4" />
        Додати
      </Button>
    </div>
  );
}
