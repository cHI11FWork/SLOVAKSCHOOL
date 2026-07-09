import { notFound } from "next/navigation";
import { getListTable } from "@/lib/admin-data";
import { LIST_TABLES, type ListTableName } from "@/lib/admin-tables";
import { ListEditor } from "@/components/admin/list-editor";
import { Reveal } from "@/components/motion/reveal";

export default async function ListPage({ params }: { params: Promise<{ table: string }> }) {
  const { table } = await params;

  if (!(table in LIST_TABLES)) notFound();
  const tableName = table as ListTableName;
  const config = LIST_TABLES[tableName];

  const items = await getListTable<{ id: string; visible: boolean; position: number }>(tableName);

  return (
    <div>
      <Reveal>
        <h1 className="text-2xl font-bold text-navy">{config.label}</h1>
        <p className="mt-1 text-sm text-navy/60">
          Перетягуйте для зміни порядку, вимикайте перемикачем, щоб приховати без видалення.
        </p>
      </Reveal>

      <div className="mt-6">
        <ListEditor
          table={tableName}
          fields={config.fields}
          emptyItem={config.emptyItem}
          initialItems={items as never}
        />
      </div>
    </div>
  );
}
