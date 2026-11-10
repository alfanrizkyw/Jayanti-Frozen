import type { Metadata } from "next";
import { StaffLogin } from "@/components/staff-login";

export const metadata: Metadata = {
  title: "Masuk developer",
  robots: { index: false, follow: false },
};

export default function DeveloperMasukPage() {
  return <StaffLogin peran="developer" />;
}
