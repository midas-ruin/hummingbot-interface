import { Metadata } from 'next';
import MarketList from '../../components/MarketList';

export const metadata: Metadata = {
  title: 'Markets | Hummingbot Interface',
  description: 'View market data and trading opportunities',
};

export default function MarketsPage() {
  return <MarketList />;
}
