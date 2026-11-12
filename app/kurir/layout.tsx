import { redirect } from "next/navigation";
import { KurirShell } from "@/components/kurir/kurir-shell";
import { getSession } from "@/lib/auth";

export const metadata = { title: "Kurir" };

export default async function KurirLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "kurir") redirect("/kurir/masuk");

  return (
    <KurirShell nama={session.nama ?? "Tim Kurir Yanti"} kendaraan="Tim pengantaran">
      {children}
    </KurirShell>
  );
}
