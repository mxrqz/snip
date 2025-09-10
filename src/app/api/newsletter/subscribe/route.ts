import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/utils/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import { NewsletterSubscriptionRequest, NewsletterSubscriptionResponse } from '@/app/types/types';
import { Resend } from 'resend';

// Email validation regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body: NewsletterSubscriptionRequest = await request.json();
    const { email, source = 'landing-page' } = body;

    // Validate email format
    if (!email || typeof email !== 'string') {
      return NextResponse.json<NewsletterSubscriptionResponse>({
        success: false,
        error: 'Email é obrigatório'
      }, { status: 400 });
    }

    if (!emailRegex.test(email.trim())) {
      return NextResponse.json<NewsletterSubscriptionResponse>({
        success: false,
        error: 'Email inválido'
      }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existingSubscriber = await db
      .collection('newsletter')
      .where('email', '==', normalizedEmail)
      .where('active', '==', true)
      .limit(1)
      .get();

    // If email already exists, return success (but don't add again)
    if (!existingSubscriber.empty) {
      return NextResponse.json<NewsletterSubscriptionResponse>({
        success: true,
        message: 'Email cadastrado com sucesso!'
      });
    }

    // Add new subscriber to Firestore
    const subscriberData = {
      email: normalizedEmail,
      subscribedAt: Timestamp.now(),
      active: true,
      source: source
    };

    await db.collection('newsletter').add(subscriberData);

    // Also add to Resend (if API key is configured)
    if (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) {
      try {
        await resend.contacts.create({
          email: normalizedEmail,
          audienceId: process.env.RESEND_AUDIENCE_ID,
        });
      } catch (resendError) {
        // Log the error but don't fail the request
        console.error('Resend sync error:', resendError);
      }
    }

    return NextResponse.json<NewsletterSubscriptionResponse>({
      success: true,
      message: 'Email cadastrado com sucesso!'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    return NextResponse.json<NewsletterSubscriptionResponse>({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}