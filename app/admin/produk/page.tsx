import { ProductManager } from "@/components/admin/product-manager";
import { getAdminData } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Produk · Admin" };

export default async function AdminProducts() {
  const db = await getAdminData();
  const kategori = [...new Set(db.products.map((p) => p.kategori))].sort();

  return <ProductManager products={db.products} kategori={kategori} />;
}
