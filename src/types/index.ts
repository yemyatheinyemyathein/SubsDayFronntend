export interface User {
  id: string;
  name: string;
  email: string;
  baseCurrency: string;
}

export interface SharedMember {
  user?: string;
  email: string;
  status: 'pending' | 'active';
  shareAmount: number;
  joinedAt?: string;
}

export interface Subscription {
  _id: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'weekly' | 'custom';
  nextBillingDate: string;
  startDate?: string;
  endDate?: string;
  category: string;
  status: 'active' | 'canceled';
  logo?: string;
  notes?: string;
  isShared: boolean;
  sharedMembers?: SharedMember[];
  splitType: 'equal' | 'custom';
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  monthlySpending: number;
  yearlyProjection: number;
  categoryBreakdown: { category: string; total: number; count: number }[];
  upcomingPayments: { name: string; price: number; currency: string; date: string }[];
  totalActive: number;
  baseCurrency: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export type BillingCycle = Subscription['billingCycle'];

export const CATEGORIES = [
  'Streaming',
  'Music',
  'Gaming',
  'Software',
  'Cloud Storage',
  'News & Media',
  'Fitness',
  'Education',
  'Productivity',
  'Communication',
  'Finance',
  'Other',
];

export const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL',
  'KRW', 'MXN', 'SGD', 'HKD', 'NOK', 'SEK', 'DKK', 'NZD', 'ZAR', 'TRY',
];

export const BILLING_CYCLES: { value: BillingCycle; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'custom', label: 'Custom' },
];
