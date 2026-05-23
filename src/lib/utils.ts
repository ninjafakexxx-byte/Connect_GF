import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function isoDateToBR(value?: string | null) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("pt-BR");
}

export function isoDateTimeToBR(value?: string | null) {
  if (!value) return "-";

  return new Date(value).toLocaleString("pt-BR");
}

export function brDateToISO(value?: string | null) {
  if (!value) return "";

  const [day, month, year] = value.split("/");

  return `${year}-${month}-${day}`;
}

export function brDateTimeToISO(value?: string | null) {
  if (!value) return "";

  const [date, time] = value.split(" ");
  const [day, month, year] = date.split("/");

  return `${year}-${month}-${day}T${time ?? "00:00"}`;
}