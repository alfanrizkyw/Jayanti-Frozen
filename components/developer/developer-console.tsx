"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Bug as BugIcon,
  Check,
  CheckCircle2,
  Database,
  ExternalLink,
  KeyRound,
  Loader2,
  LogOut,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { relatif } from "@/lib/format";
import type {
  Bug,
  BugStatus,
  CourierPublic,
  Settings,
  StaffPublic,
} from "@/lib/types";

export function DeveloperConsole({
  staff,
  couriers,
  bugs,
  settings,
  mode,
  sheetId,
  waSiap,
  waProvider,
}: {
  staff: StaffPublic[];
  couriers: CourierPublic[];
  bugs: Bug[];
  settings: Settings;
  mode: "sheets" | "lokal" | "belum";
  sheetId: string;
  waSiap: boolean;
  waProvider: string;
}) {
  const router = useRouter();
  const [proses, setProses] = useState("");
  const [pesan, setPesan] = useState("");
  const [error, setError] = useState("");

  const [adminBaru, setAdminBaru] = useState({ nama: "", telepon: "", sandi: "" });
  const [kurirBaru, setKurirBaru] = useState({
    nama: "",
    telepon: "",
    kendaraan: "",
    sandi: "",
  });
  const [sandiBaru, setSandiBaru] = useState<Record<string, string>>({});
  const [filterBug, setFilterBug] = useState<"semua" | BugStatus>("semua");

  const bugBaru = bugs.filter((b) => b.status === "baru").length;

  async function kirim(url: string, body: Record<string, unknown>, label: string) {
    setProses(label);
    setError("");
    setPesan("");
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Perubahan gagal disimpan.");
      setPesan("Perubahan tersimpan.");
      router.refresh();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Perubahan gagal disimpan.");
      return false;
    } finally {
      setProses("");
    }
  }

  async function keluar() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/developer/masuk");
    router.refresh();
  }

  const bugsTampil =
    filterBug === "semua" ? bugs : bugs.filter((b) => b.status === filterBug);

  return (
    <div className="min-h-svh bg-paper">
      <header className="bg-navy-deep text-white">
        <div className="mx-auto flex w-full max-w-[1120px] flex-wrap items-center gap-3 px-4 py-3 md:px-6">
          <Link href="/" aria-label="Jayanti Frozen, ke beranda">
            <Logo tone="light" size={38} />
          </Link>
          <span className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-sky">
            Developer
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/"
              className="hidden min-h-10 items-center gap-1.5 rounded-lg px-3 text-[12px] font-semibold text-white/70 hover:bg-white/10 hover:text-white sm:flex"
            >
              <ArrowLeft size={14} /> Toko
            </Link>
            <button
              type="button"
              onClick={keluar}
              className="flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-[12px] font-semibold text-white/70 hover:bg-white/10 hover:text-white"
            >
              <LogOut size={15} /> Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1120px] space-y-5 px-4 py-6 md:px-6 md:py-8">
        <div>
          <p className="eyebrow">Panel developer</p>
          <h1 className="mt-1 text-[26px] font-extrabold text-navy md:text-[32px]">
            Kesehatan sistem & akun staff
          </h1>
          <p className="mt-1 max-w-[620px] text-[12.5px] leading-relaxed text-muted">
            Halaman ini hanya bisa dibuka dengan sandi developer. Semua sandi
            staff disimpan sebagai hash dan tidak pernah ditampilkan di sini.
          </p>
        </div>

        {(pesan || error) && (
          <div
            role={error ? "alert" : "status"}
            className={`flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-[12px] ${
              error
                ? "border-[#F5CFCB] bg-[#FDF2F1] text-[#8F2E25]"
                : "border-[#C6E7DA] bg-leaf-soft text-leaf"
            }`}
          >
            {error ? (
              <AlertCircle size={14} className="mt-0.5 flex-none" />
            ) : (
              <CheckCircle2 size={14} className="mt-0.5 flex-none" />
            )}
            {error || pesan}
          </div>
        )}

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Bug baru", nilai: String(bugBaru), icon: BugIcon },
            { label: "Akun admin", nilai: String(staff.length), icon: ShieldCheck },
            { label: "Akun kurir", nilai: String(couriers.length), icon: UserRound },
            {
              label: "Database",
              nilai: mode === "sheets" ? "Sheets" : mode === "lokal" ? "Lokal" : "Belum",
              icon: Database,
            },
          ].map(({ label, nilai, icon: Icon }) => (
            <div key={label} className="card flex items-center gap-3 p-4">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-mist text-brand">
                <Icon size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-muted">
                  {label}
                </p>
                <p className="stat-num truncate text-[19px] font-extrabold text-navy">
                  {nilai}
                </p>
              </div>
            </div>
          ))}
        </section>

        <section className="card p-4 md:p-5">
          <h2 className="text-[15px] font-extrabold text-navy">Status layanan</h2>
          <ul className="mt-3 grid gap-2.5 text-[12px] sm:grid-cols-2">
            <li className="flex items-start gap-2.5 rounded-xl border border-line px-3.5 py-3">
              <Database size={15} className="mt-0.5 flex-none text-brand" />
              <div className="min-w-0">
                <p className="font-bold text-navy">
                  {mode === "belum"
                    ? "Google Sheets belum terhubung"
                    : `Google Sheets ${mode === "sheets" ? "terhubung" : "belum aktif"}`}
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                  {mode === "sheets"
                    ? "Data pesanan dan staff tersimpan di spreadsheet."
                    : mode === "lokal"
                      ? "Server pengembangan memakai berkas lokal. Produksi selalu memakai Google Sheets."
                      : "Isi GOOGLE_SHEETS_URL dan GOOGLE_SHEETS_KEY lalu redeploy."}
                </p>
                <a
                  href={`https://docs.google.com/spreadsheets/d/${sheetId}/edit`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-brand"
                >
                  Buka spreadsheet <ExternalLink size={11} />
                </a>
              </div>
            </li>
            <li className="flex items-start gap-2.5 rounded-xl border border-line px-3.5 py-3">
              <KeyRound size={15} className="mt-0.5 flex-none text-brand" />
              <div>
                <p className="font-bold text-navy">
                  Notifikasi WhatsApp {waSiap ? "siap" : "belum aktif"}
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                  {waSiap
                    ? `Pesanan baru dikirim ke ${settings.whatsappAdmin} lewat ${waProvider}.`
                    : "Isi FONNTE_TOKEN atau WHATSAPP_TOKEN + WHATSAPP_PHONE_NUMBER_ID di server agar pesanan baru dikirim otomatis."}
                </p>
                <p className="mt-1.5 text-[11px] font-semibold text-navy">
                  Nomor admin: {settings.whatsappAdmin}
                </p>
              </div>
            </li>
          </ul>
        </section>

        <section className="card p-4 md:p-5" id="akun-admin">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-extrabold text-navy">Akun admin</h2>
              <p className="mt-0.5 text-[11.5px] text-muted">
                Tambah admin, ganti sandi, atau nonaktifkan akses.
              </p>
            </div>
            <span className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-extrabold text-brand">
              {staff.length}
            </span>
          </div>

          <ul className="mt-3 divide-y divide-line">
            {staff.map((s) => (
              <li key={s.id} className="py-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-navy text-[11px] font-extrabold text-white">
                    {s.nama
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-bold text-navy">
                      {s.nama}
                    </p>
                    <p className="text-[10.5px] text-muted">
                      {s.telepon || "Tanpa nomor HP"} ·{" "}
                      {s.aktif ? "Aktif" : "Nonaktif"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      kirim(
                        "/api/developer/staff",
                        { id: s.id, nama: s.nama, telepon: s.telepon, aktif: !s.aktif },
                        `status-${s.id}`,
                      )
                    }
                    disabled={Boolean(proses)}
                    className="btn btn-outline btn-sm"
                  >
                    {proses === `status-${s.id}` ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : s.aktif ? (
                      "Nonaktifkan"
                    ) : (
                      "Aktifkan"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      kirim(
                        "/api/developer/staff",
                        { aksi: "hapus", id: s.id },
                        `hapus-${s.id}`,
                      )
                    }
                    disabled={Boolean(proses)}
                    className="btn btn-danger btn-sm"
                    aria-label={`Hapus akun ${s.nama}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap items-end gap-2 pl-0 sm:pl-11">
                  <div className="min-w-[180px] flex-1">
                    <label htmlFor={`sandi-${s.id}`} className="label mb-1 text-[11px]">
                      Sandi baru (kosongkan bila tetap)
                    </label>
                    <input
                      id={`sandi-${s.id}`}
                      type="password"
                      className="field min-h-11"
                      value={sandiBaru[s.id] ?? ""}
                      onChange={(e) =>
                        setSandiBaru((v) => ({ ...v, [s.id]: e.target.value }))
                      }
                      autoComplete="new-password"
                      placeholder="Minimal 6 karakter"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={Boolean(proses) || !(sandiBaru[s.id] ?? "").trim()}
                    onClick={async () => {
                      const ok = await kirim(
                        "/api/developer/staff",
                        {
                          id: s.id,
                          nama: s.nama,
                          telepon: s.telepon,
                          aktif: s.aktif,
                          sandi: sandiBaru[s.id],
                        },
                        `sandi-${s.id}`,
                      );
                      if (ok) setSandiBaru((v) => ({ ...v, [s.id]: "" }));
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    {proses === `sandi-${s.id}` ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <KeyRound size={13} />
                    )}
                    Simpan sandi
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const ok = await kirim(
                "/api/developer/staff",
                adminBaru,
                "tambah-admin",
              );
              if (ok) setAdminBaru({ nama: "", telepon: "", sandi: "" });
            }}
            className="mt-3 rounded-xl border border-dashed border-[#C9E1F7] bg-paper/60 p-3"
          >
            <p className="text-[12px] font-extrabold text-navy">Tambah akun admin</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              <input
                className="field min-h-11"
                value={adminBaru.nama}
                onChange={(e) => setAdminBaru({ ...adminBaru, nama: e.target.value })}
                placeholder="Nama admin"
                aria-label="Nama admin baru"
                required
              />
              <input
                className="field min-h-11"
                value={adminBaru.telepon}
                onChange={(e) =>
                  setAdminBaru({ ...adminBaru, telepon: e.target.value })
                }
                placeholder="Nomor HP (opsional)"
                aria-label="Nomor HP admin baru"
                inputMode="tel"
              />
              <input
                className="field min-h-11"
                type="password"
                value={adminBaru.sandi}
                onChange={(e) => setAdminBaru({ ...adminBaru, sandi: e.target.value })}
                placeholder="Sandi minimal 6 karakter"
                aria-label="Sandi admin baru"
                autoComplete="new-password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={Boolean(proses)}
              className="btn btn-navy btn-sm mt-2"
            >
              {proses === "tambah-admin" ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Plus size={13} />
              )}
              Tambah admin
            </button>
          </form>
        </section>

        <section className="card p-4 md:p-5" id="akun-kurir">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-extrabold text-navy">Akun kurir</h2>
              <p className="mt-0.5 text-[11.5px] text-muted">
                Atur identitas, sandi, dan status aktif kurir.
              </p>
            </div>
            <span className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-extrabold text-brand">
              {couriers.length}
            </span>
          </div>

          <ul className="mt-3 divide-y divide-line">
            {couriers.map((c) => (
              <li key={c.id} className="py-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand text-[11px] font-extrabold text-white">
                    {c.nama
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-bold text-navy">
                      {c.nama}
                    </p>
                    <p className="text-[10.5px] text-muted">
                      {c.telepon} · {c.kendaraan || "Kendaraan belum diisi"} ·{" "}
                      {c.aktif ? "Aktif" : "Nonaktif"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      kirim(
                        "/api/developer/kurir",
                        {
                          id: c.id,
                          nama: c.nama,
                          telepon: c.telepon,
                          kendaraan: c.kendaraan,
                          aktif: !c.aktif,
                        },
                        `status-k-${c.id}`,
                      )
                    }
                    disabled={Boolean(proses)}
                    className="btn btn-outline btn-sm"
                  >
                    {proses === `status-k-${c.id}` ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : c.aktif ? (
                      "Nonaktifkan"
                    ) : (
                      "Aktifkan"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      kirim(
                        "/api/developer/kurir",
                        { aksi: "hapus", id: c.id },
                        `hapus-k-${c.id}`,
                      )
                    }
                    disabled={Boolean(proses)}
                    className="btn btn-danger btn-sm"
                    aria-label={`Hapus kurir ${c.nama}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap items-end gap-2 sm:pl-11">
                  <div className="min-w-[180px] flex-1">
                    <label
                      htmlFor={`sandi-k-${c.id}`}
                      className="label mb-1 text-[11px]"
                    >
                      Sandi baru (kosongkan bila tetap)
                    </label>
                    <input
                      id={`sandi-k-${c.id}`}
                      type="password"
                      className="field min-h-11"
                      value={sandiBaru[c.id] ?? ""}
                      onChange={(e) =>
                        setSandiBaru((v) => ({ ...v, [c.id]: e.target.value }))
                      }
                      autoComplete="new-password"
                      placeholder="Minimal 6 karakter"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={Boolean(proses) || !(sandiBaru[c.id] ?? "").trim()}
                    onClick={async () => {
                      const ok = await kirim(
                        "/api/developer/kurir",
                        {
                          id: c.id,
                          nama: c.nama,
                          telepon: c.telepon,
                          kendaraan: c.kendaraan,
                          aktif: c.aktif,
                          sandi: sandiBaru[c.id],
                        },
                        `sandi-k-${c.id}`,
                      );
                      if (ok) setSandiBaru((v) => ({ ...v, [c.id]: "" }));
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    {proses === `sandi-k-${c.id}` ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <KeyRound size={13} />
                    )}
                    Simpan sandi
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const ok = await kirim(
                "/api/developer/kurir",
                kurirBaru,
                "tambah-kurir",
              );
              if (ok)
                setKurirBaru({ nama: "", telepon: "", kendaraan: "", sandi: "" });
            }}
            className="mt-3 rounded-xl border border-dashed border-[#C9E1F7] bg-paper/60 p-3"
          >
            <p className="text-[12px] font-extrabold text-navy">Tambah akun kurir</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <input
                className="field min-h-11"
                value={kurirBaru.nama}
                onChange={(e) => setKurirBaru({ ...kurirBaru, nama: e.target.value })}
                placeholder="Nama kurir"
                aria-label="Nama kurir baru"
                required
              />
              <input
                className="field min-h-11"
                value={kurirBaru.telepon}
                onChange={(e) =>
                  setKurirBaru({ ...kurirBaru, telepon: e.target.value })
                }
                placeholder="Nomor HP kurir"
                aria-label="Nomor HP kurir baru"
                inputMode="tel"
                required
              />
              <input
                className="field min-h-11"
                value={kurirBaru.kendaraan}
                onChange={(e) =>
                  setKurirBaru({ ...kurirBaru, kendaraan: e.target.value })
                }
                placeholder="Kendaraan & nomor polisi"
                aria-label="Kendaraan kurir baru"
              />
              <input
                className="field min-h-11"
                type="password"
                value={kurirBaru.sandi}
                onChange={(e) => setKurirBaru({ ...kurirBaru, sandi: e.target.value })}
                placeholder="Sandi minimal 6 karakter"
                aria-label="Sandi kurir baru"
                autoComplete="new-password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={Boolean(proses)}
              className="btn btn-navy btn-sm mt-2"
            >
              {proses === "tambah-kurir" ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Plus size={13} />
              )}
              Tambah kurir
            </button>
          </form>
        </section>

        <section className="card p-4 md:p-5" id="bug">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-extrabold text-navy">Bug & error</h2>
              <p className="mt-0.5 text-[11.5px] text-muted">
                Error dari browser pengunjung tercatat otomatis di sini.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["semua", "baru", "diproses", "selesai"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilterBug(f)}
                  className={`chip min-h-9 px-3 text-[11.5px] ${
                    filterBug === f ? "chip-active" : ""
                  }`}
                >
                  {f === "semua" ? "Semua" : f}
                </button>
              ))}
            </div>
          </div>

          <ul className="mt-3 space-y-2.5">
            {bugsTampil.map((b) => (
              <li key={b.id} className="rounded-xl border border-line p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                      b.status === "baru"
                        ? "bg-[#FFF4E3] text-[#8A520B]"
                        : b.status === "diproses"
                          ? "bg-mist text-brand"
                          : "bg-leaf-soft text-leaf"
                    }`}
                  >
                    {b.status}
                  </span>
                  <p className="text-[10.5px] text-muted">
                    {b.halaman || "halaman tidak diketahui"} · {b.peran || "pengunjung"} ·{" "}
                    {relatif(b.dibuat)}
                  </p>
                </div>
                <p className="mt-1.5 break-words text-[12px] leading-relaxed text-navy">
                  {b.pesan}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {b.status !== "diproses" && (
                    <button
                      type="button"
                      onClick={() =>
                        kirim(
                          "/api/developer/bugs",
                          { id: b.id, status: "diproses" },
                          `bug-proses-${b.id}`,
                        )
                      }
                      disabled={Boolean(proses)}
                      className="btn btn-outline btn-sm"
                    >
                      {proses === `bug-proses-${b.id}` ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <RefreshCw size={12} />
                      )}
                      Proses
                    </button>
                  )}
                  {b.status !== "selesai" && (
                    <button
                      type="button"
                      onClick={() =>
                        kirim(
                          "/api/developer/bugs",
                          { id: b.id, status: "selesai" },
                          `bug-selesai-${b.id}`,
                        )
                      }
                      disabled={Boolean(proses)}
                      className="btn btn-primary btn-sm"
                    >
                      {proses === `bug-selesai-${b.id}` ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Check size={12} />
                      )}
                      Selesai
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      kirim(
                        "/api/developer/bugs",
                        { aksi: "hapus", id: b.id },
                        `bug-hapus-${b.id}`,
                      )
                    }
                    disabled={Boolean(proses)}
                    className="btn btn-danger btn-sm"
                    aria-label="Hapus laporan bug"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </li>
            ))}
            {bugsTampil.length === 0 && (
              <li className="rounded-xl bg-leaf-soft px-3.5 py-4 text-[12px] font-semibold text-leaf">
                Tidak ada laporan pada filter ini.
              </li>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}
