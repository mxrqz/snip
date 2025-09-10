import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Gerenciar Links',
  description: 'Gerencie seus links encurtados, visualize analytics e crie novos links com proteção por senha e data de expiração.',
  robots: {
    index: false, // Dashboard é privado
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}