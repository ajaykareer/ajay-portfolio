export const contactEmail = 'ajaykareer06@gmail.com';

// EmailJS browser identifiers supplied by Ajay for his Contact Us template.
// These are public configuration, not email-account credentials or private keys.
const emailService = {
  service_id: 'service_ovwlc2h',
  template_id: 'template_bp8isip',
  user_id: 'c-RlWV4po2dgg7cga',
};

export type ContactDraft = { name: string; email: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactDraft, string>>;

export function validateContact(draft: ContactDraft): ContactErrors {
  const errors: ContactErrors = {};
  if (draft.name.trim().length < 2 || draft.name.trim().length > 80)
    errors.name = 'Please enter your name (2–80 characters).';
  if (
    draft.email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())
  )
    errors.email = 'Please enter a valid email address so I can reply.';
  if (draft.message.trim().length < 10 || draft.message.trim().length > 5000)
    errors.message = 'Please write a message between 10 and 5,000 characters.';
  return errors;
}

export async function sendContactMessage(
  draft: ContactDraft,
  request: typeof fetch = fetch,
) {
  if (Object.keys(validateContact(draft)).length)
    throw new Error('Please check the highlighted fields.');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  const submittedAt = new Date();
  try {
    const response = await request(
      'https://api.emailjs.com/api/v1.0/email/send',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...emailService,
          template_params: {
            // The receiving address is fixed in EmailJS, never supplied by visitors.
            name: draft.name.trim(),
            email: draft.email.trim(),
            title: 'Ajay Kareer Portfolio',
            date: submittedAt.toLocaleDateString('en-CA', {
              timeZone: 'America/Toronto',
            }),
            time: submittedAt.toLocaleTimeString('en-CA', {
              timeZone: 'America/Toronto',
              timeZoneName: 'short',
            }),
            message: draft.message.trim(),
          },
        }),
        signal: controller.signal,
      },
    );
    if (response.status === 429)
      throw new Error(
        'A few too many messages at once. Please wait a minute, or email me directly below.',
      );
    if (!response.ok || (await response.text()).trim() !== 'OK')
      throw new Error(
        'Message delivery could not be confirmed. Your message is still here — please try again, or email me directly below.',
      );
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('A few too many'))
      throw error;
    throw new Error(
      'Message delivery could not be confirmed. Your message is still here — please try again, or email me directly below.',
    );
  } finally {
    clearTimeout(timeout);
  }
}

export function contactMailto(draft: ContactDraft) {
  return `mailto:${contactEmail}?subject=${encodeURIComponent('Hello from your portfolio')}&body=${encodeURIComponent(`${draft.message}\n\n${draft.name}\n${draft.email}`)}`;
}
