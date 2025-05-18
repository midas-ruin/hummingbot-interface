import { Metadata } from 'next';
import Dashboard from '@/components/Dashboard';

export const metadata: Metadata = {
  title: 'Dashboard | Hummingbot Interface',
  description: 'Monitor and manage your trading bots',
};

export default function HomePage() {
  return <Dashboard />;
}
