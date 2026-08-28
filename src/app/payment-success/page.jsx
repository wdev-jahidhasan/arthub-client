import { redirect } from 'next/navigation';
import { stripe } from '../../lib/stripe';
import CommentModal from '../../components/dashboardComp/CommentModal';

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error('Please provide a valid session_id (`cs_test_...`)');
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'payment_intent']
    });
  } catch (error) {
    return redirect('/');
  }

  const { status, metadata, customer_details, payment_intent } = session;
  const customerEmail = customer_details?.email || 'valued customer';

  if (status === 'open') {
    return redirect('/');
  }

  if (status === 'complete') {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/purchases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: session.id,
        paymentIntentId: typeof payment_intent === 'string' ? payment_intent : payment_intent?.id,
        customerEmail,
        amountTotal: session.amount_total / 100,
        currency: session.currency,
        metadata,
        status,
      }),
    });

    const artworkId = metadata?.artworkId || '';
    const userId = metadata?.userId || '';
    const userEmail = metadata?.userEmail || customerEmail;

    return (
      <CommentModal 
        artworkId={artworkId} 
        userId={userId}
        userEmail={userEmail} 
        customerEmail={customerEmail} 
        status={status} 
      />
    );
  }
}