const WEBINAR_TZ = "Europe/Kyiv";

function kyivOffsetMinutes(date: Date): number {
  const part = new Intl.DateTimeFormat("en-US", {
    timeZone: WEBINAR_TZ,
    timeZoneName: "shortOffset",
  })
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName")?.value;
  const match = part?.match(/GMT([+-]\d+)(?::(\d+))?/);
  const hours = match ? parseInt(match[1], 10) : 2;
  const minutes = match?.[2] ? parseInt(match[2], 10) : 0;
  return hours * 60 + (hours < 0 ? -minutes : minutes);
}

/** ISO instant -> "YYYY-MM-DDTHH:mm" for an `<input type="datetime-local">`, in Kyiv wall-clock time. */
export function isoToKyivInputValue(iso: string): string {
  const date = new Date(iso);
  const shifted = new Date(date.getTime() + kyivOffsetMinutes(date) * 60_000);
  return shifted.toISOString().slice(0, 16);
}

/** `<input type="datetime-local">` value (interpreted as Kyiv wall-clock time) -> ISO instant. */
export function kyivInputValueToIso(value: string): string {
  const naiveUtc = new Date(`${value}:00.000Z`);
  const utcMs = naiveUtc.getTime() - kyivOffsetMinutes(naiveUtc) * 60_000;
  return new Date(utcMs).toISOString();
}

/** "20 серпня о 18:00" in Kyiv time, for the webinar page copy. */
export function formatWebinarDate(iso: string): string {
  const date = new Date(iso);
  const day = new Intl.DateTimeFormat("uk-UA", {
    timeZone: WEBINAR_TZ,
    day: "numeric",
    month: "long",
  }).format(date);
  const time = new Intl.DateTimeFormat("uk-UA", {
    timeZone: WEBINAR_TZ,
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  return `${day} о ${time}`;
}
