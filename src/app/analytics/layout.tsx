import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics - Métricas Detalhadas',
  description: 'Visualize analytics detalhados dos seus links: métricas geográficas, dispositivos, referrers e muito mais.',
  robots: {
    index: false, // Analytics são privados
    follow: false,
  },
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}