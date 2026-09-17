import test from 'node:test';
import assert from 'node:assert/strict';
import {
  contactMailto,
  sendContactMessage,
  validateContact,
} from '../lib/contact.ts';

const draft = {
  name: '  Jamie Visitor  ',
  email: ' jamie@example.com ',
  message: '  Hello Ajay, I would like to discuss a project.  ',
};

test('invalid and oversized submissions are blocked before contacting the email service', async () => {
  assert.deepEqual(
    Object.keys(
      validateContact({ name: ' ', email: 'bad-email', message: 'hi' }),
    ),
    ['name', 'email', 'message'],
  );
  assert.ok(validateContact({ ...draft, message: 'x'.repeat(5001) }).message);
  let called = false;
  await assert.rejects(
    sendContactMessage({ ...draft, email: 'a@b' }, async () => {
      called = true;
      return new Response('OK');
    }),
  );
  assert.equal(called, false);
});

test('delivery matches the supplied template and leaves its recipient under provider control', async () => {
  await sendContactMessage(draft, async (url, init) => {
    assert.equal(url, 'https://api.emailjs.com/api/v1.0/email/send');
    assert.equal(init.method, 'POST');
    const body = JSON.parse(init.body);
    assert.equal(body.service_id, 'service_ovwlc2h');
    assert.equal(body.template_id, 'template_bp8isip');
    assert.equal(body.template_params.to_email, undefined);
    assert.equal(body.template_params.name, 'Jamie Visitor');
    assert.equal(body.template_params.email, 'jamie@example.com');
    assert.equal(body.template_params.title, 'Ajay Kareer Portfolio');
    assert.ok(body.template_params.date);
    assert.ok(body.template_params.time);
    assert.equal(body.template_params.message, draft.message.trim());
    assert.ok(init.signal instanceof AbortSignal);
    return new Response('OK', { status: 200 });
  });
});

test('provider failures and unexpected responses never report success', async () => {
  for (const response of [
    new Response('Forbidden', { status: 403 }),
    new Response('<html>Unexpected page</html>', { status: 200 }),
  ]) {
    await assert.rejects(
      sendContactMessage(draft, async () => response),
      /delivery could not be confirmed/,
    );
  }
  await assert.rejects(
    sendContactMessage(draft, async () => {
      throw new TypeError('Failed to fetch');
    }),
    /Your message is still here/,
  );
  await assert.rejects(
    sendContactMessage(
      draft,
      async () => new Response('Too many requests', { status: 429 }),
    ),
    /wait a minute/,
  );
});

test('email fallback preserves the draft without allowing subject or recipient injection', () => {
  const message = 'Hello & thanks!\nEmail: friend+test@example.com';
  const url = new URL(contactMailto({ ...draft, message }));
  assert.equal(url.pathname, 'ajaykareer06@gmail.com');
  assert.equal(url.searchParams.get('subject'), 'Hello from your portfolio');
  assert.ok(url.searchParams.get('body').startsWith(message));
  assert.deepEqual([...url.searchParams.keys()], ['subject', 'body']);
});
