import { Metadata } from 'next';
import CreateBotForm from '../../../components/CreateBotForm';

export const metadata: Metadata = {
  title: 'Create Bot | Hummingbot Interface',
  description: 'Create a new trading bot',
};

export default function CreateBotPage() {
  return <CreateBotForm />;
}
