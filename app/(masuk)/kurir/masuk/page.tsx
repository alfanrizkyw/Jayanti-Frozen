import type { Metadata } from "next";
import { StaffLogin } from "@/components/staff-login";

export const metadata: Metadata = {
  title: "Masuk kurir",
  robots: { index: false, follow: false },
};

export default function KurirMasukPage() {
  return <StaffLogin peran="kurir" />;
}
