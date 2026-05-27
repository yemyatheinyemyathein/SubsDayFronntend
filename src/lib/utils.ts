export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function getDaysUntil(date: string): number {
  const now = new Date();
  const target = new Date(date);
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getLogoUrl(name: string): string {
  return `https://www.google.com/s2/favicons?domain=${name.toLowerCase().replace(/\s+/g, '')}.com&sz=64`;
}
