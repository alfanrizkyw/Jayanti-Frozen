import type { Metadata } from "next";
import { StaffLogin } from "@/components/staff-login";

export const metadata: Metadata = {
  title: "Masuk admin",
  robots: { index: false, follow: false },
};

export default function AdminMasukPage() {
  return <StaffLogin peran="admin" />;
}
