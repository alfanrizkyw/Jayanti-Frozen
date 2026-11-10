import { PromoManager } from "@/components/admin/promo-manager";
import { getAdminData } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Promo · Admin" };

export default async function AdminPromos() {
  const db = await getAdminData();
  const promotions = [...db.promotions].sort((a, b) => b.mulai.localeCompare(a.mulai));
  return <PromoManager promotions={promotions} />;
}
