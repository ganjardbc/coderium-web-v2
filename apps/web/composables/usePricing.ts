// Single source for package names, durations, and prices shown on the homepage
// and on /work-with-us, so the two pages can never disagree. Every value comes
// from the "Data yang boleh dipakai" section of
// docs/development/agency-pivot/requirements.md. Do not add figures here that
// are not recorded there.

export interface PricingPlan {
  id: 'ai-code-review' | 'caf' | 'retainer';
  name: string;
  scope: string;
  price: string;
  /** Billing period suffix, e.g. "per bulan". Omitted for one-off pilots. */
  priceUnit?: string;
  /** Only the two pilots have a recorded pioneer price. */
  pioneerPrice?: string;
  note?: string;
  /** Subject of the mailto: link for this plan. */
  subject: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'ai-code-review',
    name: 'Pilot AI Code Review',
    scope: '4 minggu, 1 repo',
    price: 'Rp13.000.000',
    pioneerPrice: 'Rp9.100.000',
    subject: 'Diskusi pilot AI Code Review',
  },
  {
    id: 'caf',
    name: 'Pilot CAF',
    scope: '6-8 minggu, 1 repo',
    price: 'Rp19.500.000',
    pioneerPrice: 'Rp13.650.000',
    note: 'Rp2.000.000 di muka untuk fit check minggu 1.',
    subject: 'Diskusi pilot CAF',
  },
  {
    id: 'retainer',
    name: 'Retainer',
    scope: 'hingga 8 jam kerja',
    price: 'Rp2.000.000',
    priceUnit: 'per bulan',
    subject: 'Diskusi retainer',
  },
];

// The plan shown with a filled button wherever the cards are listed.
export const HIGHLIGHTED_PLAN_ID: PricingPlan['id'] = 'caf';

export const PIONEER_PRICE_NOTE = 'Diskon 30% dengan izin studi kasus.';

export const CLIENT_COST_NOTE = 'Biaya server dan model ditanggung klien.';
