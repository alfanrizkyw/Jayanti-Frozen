import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getSession } from "@/lib/auth";
import { getAdminData } from "@/lib/data";

export const metadata = { title: "Admin" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/admin/masuk");

  const db = await getAdminData();
  const baru = db.orders.filter((o) => o.status === "baru").length;

  return (
    <AdminShell nama={session.nama} baru={baru}>
      {children}
    </AdminShell>
  );
}
