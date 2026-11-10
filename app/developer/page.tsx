import { DeveloperConsole } from "@/components/developer/developer-console";
import { getDeveloperData } from "@/lib/data";
import { storageMode } from "@/lib/store";

export const dynamic = "force-dynamic";

const SPREADSHEET_ID =
  process.env.GOOGLE_SPREADSHEET_ID || "1bBqUXFwxlqM3bSh4RxwkzW97AOO7fIyWXfo7-i6Djos";

export default async function DeveloperPage() {
  const [data, mode] = await Promise.all([getDeveloperData(), storageMode()]);
  const waSiap = Boolean(
    process.env.FONNTE_TOKEN ||
      (process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID),
  );
  const waProvider = process.env.FONNTE_TOKEN
    ? "Fonnte"
    : process.env.WHATSAPP_TOKEN
      ? "WhatsApp Cloud API"
      : "belum ada";

  return (
    <DeveloperConsole
      staff={data.staff}
      couriers={data.couriers}
      bugs={data.bugs}
      settings={data.settings}
      mode={mode}
      sheetId={SPREADSHEET_ID}
      waSiap={waSiap}
      waProvider={waProvider}
    />
  );
}
