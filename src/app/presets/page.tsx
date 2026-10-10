import { getPresets } from "@/lib/actions";
import ClientPresets from "@/components/ClientPresets";

export const instant = false;

export default async function PresetsPage() {
  const presets = await getPresets();
  
  return (
    <div className="p-4 md:p-8 md:pt-12 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Quick Presets</h1>
          <p className="text-zinc-400">Save time by creating 1-click templates for your daily repeating expenses.</p>
        </div>
        <ClientPresets initialPresets={presets} />
      </div>
    </div>
  );
}
