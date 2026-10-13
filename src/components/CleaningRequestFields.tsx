import { CLEANING_OBJECTS, CLEANING_SERVICES } from "@/lib/cleaningOptions"

export default function CleaningRequestFields({ prefix, serviceName = "", variant = "landing" }: {
  prefix: string; serviceName?: string; variant?: "landing" | "contact"
}) {
  const inputClass = variant === "landing"
    ? "w-full min-w-0 px-4 sm:px-6 py-4 rounded-lg bg-surface-container-high border-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-on-surface"
    : "w-full min-w-0 h-14 px-3 bg-background border border-input focus-visible:ring-primary/20 hover:border-primary/50 transition-colors rounded-md shadow-sm"
  const labelClass = variant === "landing"
    ? "block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label"
    : "block text-xs font-bold tracking-wider text-muted-foreground uppercase"
  return <>
    <div className="space-y-2 col-span-full">
      <label htmlFor={`${prefix}-name`} className={labelClass}>Ihr Name *</label>
      <input id={`${prefix}-name`} name="full_name" required pattern=".*\S.*" title="Bitte geben Sie Ihren Namen ein." maxLength={255} autoComplete="name" className={inputClass} placeholder="Max Mustermann" type="text" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 col-span-full items-end">
      <div className="space-y-2 min-w-0">
        <label htmlFor={`${prefix}-service`} className={labelClass}>Welche Reinigung benötigen Sie? *</label>
        <select id={`${prefix}-service`} name="service_requested" required defaultValue={serviceName} className={inputClass}>
          <option value="" disabled>Bitte auswählen</option>
          {CLEANING_SERVICES.map(value => <option key={value} value={value}>{value}</option>)}
        </select>
      </div>
      <div className="space-y-2 min-w-0">
        <label htmlFor={`${prefix}-object`} className={labelClass}>Was soll gereinigt werden? *</label>
        <select id={`${prefix}-object`} name="object_type" required defaultValue="" className={inputClass}>
          <option value="" disabled>Bitte auswählen</option>
          {CLEANING_OBJECTS.map(value => <option key={value} value={value}>{value}</option>)}
        </select>
      </div>
    </div>
  </>
}
