import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import PostalMime from 'postal-mime';

const DOMAIN = 'kojalytics.com';

// Resend "email.received" webhook: forwards every mail sent to @kojalytics.com
// to EMAIL_FORWARD_TO. Reply-To is the original sender, so replying in the
// target inbox goes straight back to them.
export async function POST(request: NextRequest) {
  const { RESEND_API_KEY, RESEND_WEBHOOK_SECRET, EMAIL_FORWARD_TO } = process.env;
  if (!RESEND_API_KEY || !RESEND_WEBHOOK_SECRET || !EMAIL_FORWARD_TO) {
    return NextResponse.json({ error: 'Email forwarding is not configured' }, { status: 503 });
  }
  const resend = new Resend(RESEND_API_KEY);

  const payload = await request.text();
  let event;
  try {
    event = resend.webhooks.verify({
      payload,
      headers: {
        id: request.headers.get('svix-id') ?? '',
        timestamp: request.headers.get('svix-timestamp') ?? '',
        signature: request.headers.get('svix-signature') ?? '',
      },
      webhookSecret: RESEND_WEBHOOK_SECRET,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  if (event.type !== 'email.received') {
    return NextResponse.json({ ignored: event.type });
  }

  const { data: email, error } = await resend.emails.receiving.get(event.data.email_id);
  if (error || !email) {
    console.error('Inbound fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch email' }, { status: 500 });
  }
  if (!email.raw?.download_url) {
    return NextResponse.json({ error: 'Raw email not available' }, { status: 500 });
  }

  const raw = await fetch(email.raw.download_url).then((r) => r.arrayBuffer());
  const parsed = await PostalMime.parse(raw, { attachmentEncoding: 'base64' });

  // Send from the address the mail was sent to (e.g. ak@kojalytics.com), shown with the original sender's name.
  const recipient =
    [...email.received_for, ...email.to].find((a) => a.toLowerCase().endsWith(`@${DOMAIN}`)) ?? `inbox@${DOMAIN}`;
  const senderLabel = (parsed.from?.name ? `${parsed.from.name} (${parsed.from.address})` : email.from).replace(/["<>\r\n]/g, '');

  const { error: sendError } = await resend.emails.send(
    {
      from: `"${senderLabel}" <${recipient}>`,
      to: EMAIL_FORWARD_TO,
      replyTo: email.reply_to?.length ? email.reply_to : email.from,
      subject: email.subject || '(kein Betreff)',
      html: parsed.html || undefined,
      text: parsed.text ?? '',
      attachments: parsed.attachments.map((a) => ({
        filename: a.filename ?? 'attachment',
        content: a.content as string,
        contentType: a.mimeType,
        contentId: a.contentId?.replace(/^<|>$/g, '') || undefined,
      })),
    },
    { idempotencyKey: `forward-${email.id}` },
  );
  if (sendError) {
    console.error('Inbound forward error:', sendError);
    return NextResponse.json({ error: 'Failed to forward email' }, { status: 500 });
  }
  return NextResponse.json({ forwarded: email.id });
}
