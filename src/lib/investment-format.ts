const investmentCurrencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const HIDDEN_INVESTMENT_VALUE = "••••";

export function formatInvestmentCurrency(value: number): string {
  return investmentCurrencyFormatter.format(value);
}

export function formatCompactInvestmentCurrency(value: number): string {
  if (Math.abs(value) >= 10000000) {
    return `${value < 0 ? "-" : ""}${formatInvestmentCurrency(Math.abs(value) / 10000000).replace(".00", "")}Cr`;
  }

  if (Math.abs(value) >= 100000) {
    return `${value < 0 ? "-" : ""}${formatInvestmentCurrency(Math.abs(value) / 100000).replace(".00", "")}L`;
  }

  return formatInvestmentCurrency(value);
}

export function formatSensitiveInvestmentCurrency(value: number, isHidden: boolean): string {
  return isHidden ? HIDDEN_INVESTMENT_VALUE : formatInvestmentCurrency(value);
}

export function formatSensitiveCompactInvestmentCurrency(
  value: number,
  isHidden: boolean,
): string {
  return isHidden ? HIDDEN_INVESTMENT_VALUE : formatCompactInvestmentCurrency(value);
}
