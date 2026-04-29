const AMFI_NAV_URL =
  process.env.AMFI_NAV_URL?.trim() || "https://www.amfiindia.com/spages/NAVAll.txt";

export interface AmfiNavRecord {
  schemeCode: string;
  isinGrowth: string | null;
  isinDividend: string | null;
  schemeName: string;
  nav: number;
  navDate: string | null;
}

function parseAmfiDate(value: string): string | null {
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{2})-([A-Za-z]{3})-(\d{4})$/);

  if (!match) {
    return null;
  }

  const [, day, monthName, year] = match;
  const month = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ].indexOf(monthName.toLowerCase());

  if (month === -1) {
    return null;
  }

  return `${year}-${String(month + 1).padStart(2, "0")}-${day}`;
}

export function parseAmfiNavText(text: string): AmfiNavRecord[] {
  const rows: AmfiNavRecord[] = [];

  for (const line of text.split(/\r?\n/)) {
    const parts = line.split(";").map((part) => part.trim());

    if (parts.length < 6 || parts[0] === "Scheme Code") {
      continue;
    }

    const [schemeCode, isinDividend, isinGrowth, schemeName, navRaw, navDateRaw] = parts;
    const nav = Number.parseFloat(navRaw);

    if (!schemeCode || !schemeName || !Number.isFinite(nav)) {
      continue;
    }

    rows.push({
      schemeCode,
      isinGrowth: isinGrowth || null,
      isinDividend: isinDividend || null,
      schemeName,
      nav,
      navDate: navDateRaw ? parseAmfiDate(navDateRaw) : null,
    });
  }

  return rows;
}

export async function fetchLatestAmfiNavs(): Promise<AmfiNavRecord[]> {
  const response = await fetch(AMFI_NAV_URL, {
    headers: {
      Accept: "text/plain",
    },
  });

  if (!response.ok) {
    throw new Error(`AMFI NAV download failed with status ${response.status}.`);
  }

  return parseAmfiNavText(await response.text());
}
