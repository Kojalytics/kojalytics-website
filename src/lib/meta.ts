import { createHash } from 'node:crypto';
import { META_PIXEL_ID } from '@/lib/meta-pixel';

const GRAPH_VERSION = 'v25.0';

const sha256 = (value: string) => createHash('sha256').update(value.trim().toLowerCase()).digest('hex');

export type MetaServerEvent = {
  eventName: 'Purchase' | 'Subscribe';
  /** The same id the pixel sends as eventID, so Meta counts a purchase reported by both only once. */
  eventId: string;
  value: number;
  currency: string;
  email: string | null;
  ip: string;
  userAgent: string;
  fbp?: string;
  fbc?: string;
  sourceUrl: string;
};

/**
 * Reports an event through the Conversions API. Does nothing without META_CAPI_TOKEN.
 * Only call it for visitors who accepted tracking: it sends the same data the pixel would, plus the hashed e-mail.
 */
export async function sendMetaEvent(e: MetaServerEvent): Promise<void> {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return;
  const body = {
    data: [
      {
        event_name: e.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: e.eventId,
        action_source: 'website',
        event_source_url: e.sourceUrl,
        user_data: {
          ...(e.email && { em: [sha256(e.email)] }),
          ...(e.ip && { client_ip_address: e.ip }),
          client_user_agent: e.userAgent,
          ...(e.fbp && { fbp: e.fbp }),
          ...(e.fbc && { fbc: e.fbc }),
        },
        custom_data: { value: e.value, currency: e.currency, order_id: e.eventId },
      },
    ],
    ...(process.env.META_CAPI_TEST_CODE && { test_event_code: process.env.META_CAPI_TEST_CODE }),
  };
  const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Meta Conversions API ${res.status}: ${await res.text()}`);
}
