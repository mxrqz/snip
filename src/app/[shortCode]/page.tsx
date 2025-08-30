import { redirect, notFound } from 'next/navigation';
import { getOriginalUrl, incrementClickCount } from '@/app/utils/database';

interface Props {
  params: Promise<{
    shortCode: string;
  }>;
}

export default async function RedirectPage({ params }: Props) {
  const { shortCode } = await params;

  const originalUrl = await getOriginalUrl(shortCode);

  if (!originalUrl) {
    notFound();
  }

  // Incrementa contador de clicks
  await incrementClickCount(shortCode);

  console.log(`Redirecionando ${shortCode} -> ${originalUrl}`);
  redirect(originalUrl);
}