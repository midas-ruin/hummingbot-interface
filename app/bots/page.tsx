import { Metadata } from 'next';
import BotList from '@/components/BotList';

export const metadata: Metadata = {
  title: 'Bots | Hummingbot Interface',
  description: 'View and manage your trading bots',
};

export default function BotsPage() {
  return <BotList />;
}
