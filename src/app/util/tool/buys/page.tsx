import type { Metadata } from 'next';
import BuysPage from './BuysClient';

export const metadata: Metadata = {
  title: 'Purchase Archive',
  description: 'A curated collection of acquisitions, meticulously tracked and beautifully presented.',
};

export default function PurchasesPage() {
  return <BuysPage />;
}
