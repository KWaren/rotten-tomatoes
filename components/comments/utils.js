"use client";

// Small UI helpers for comment components
export function maskEmail(email) {
  if (!email || typeof email !== "string") return "Unknown";
  const parts = email.split("@");
  if (parts.length !== 2) return email;
  const [local, domain] = parts;
  if (local.length <= 2) return `**@${domain}`;
  return `${local[0]}***${local.slice(-1)}@${domain}`;
}

export function timeAgo(date) {
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diff = Math.floor((now - d) / 1000); // seconds
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const divisions = [
      { amount: 60, name: "second" },
      { amount: 60, name: "minute" },
      { amount: 24, name: "hour" },
      { amount: 7, name: "day" },
      { amount: 4.34524, name: "week" },
      { amount: 12, name: "month" },
      { amount: Number.POSITIVE_INFINITY, name: "year" },
    ];

    let duration = diff;
    for (let i = 0; i < divisions.length; i++) {
      const { amount, name } = divisions[i];
      if (Math.abs(duration) < amount) {
        return rtf.format(-Math.round(duration), name + (name === 'second' ? 's' : 's'));
      }
      duration = Math.floor(duration / amount);
    }
    return d.toLocaleString();
  } catch (e) {
    return new Date(date).toLocaleString();
  }
}

export function formatDateToMonthYear(date) {
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long" }).format(d);
  } catch (e) {
    return "";
  }
}
