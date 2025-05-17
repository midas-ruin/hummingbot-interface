import { Metadata } from 'next';
import Settings from '../../components/Settings';

export const metadata: Metadata = {
  title: 'Settings | Hummingbot Interface',
  description: 'Configure your bot settings and preferences',
};

export default function SettingsPage() {
  return <Settings />;
}
