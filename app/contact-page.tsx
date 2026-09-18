'use client';

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
} from 'react';
import {
  ArrowUpRight,
  Check,
  CheckCheck,
  Copy,
  LoaderCircle,
  Mail,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ContactOrbit } from './contact-orbit';
import { Reveal } from './page-motion';
import {
  contactEmail,
  contactMailto,
  sendContactMessage,
  validateContact,
  type ContactDraft,
  type ContactErrors,
} from '@/lib/contact';

const emptyDraft: ContactDraft = { name: '', email: '', message: '' };
// Kept for this tab only, so changing portfolio sections cannot bypass the cooldown.
let nextMessageAt = 0;

export function ContactPage({
  dark,
  headingRef,
}: {
  dark: boolean;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const [draft, setDraft] = useState<ContactDraft>(emptyDraft);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  );
  const [notice, setNotice] = useState('');
  const [copied, setCopied] = useState(false);
  const inFlight = useRef(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );
  useEffect(() => {
    if (status === 'sent') statusRef.current?.focus();
  }, [status]);

  const update = (field: keyof ContactDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    const problems = validateContact(draft);
    setErrors(problems);
    const firstProblem = Object.keys(problems)[0];
    if (firstProblem) {
      form
        .querySelector<HTMLInputElement | HTMLTextAreaElement>(
          `[name="${firstProblem}"]`,
        )
        ?.focus();
      return;
    }
    if (new FormData(form).get('company_website')) {
      setStatus('error');
      setNotice('Please use the direct email link below to get in touch.');
      return;
    }
    if (Date.now() < nextMessageAt) {
      setStatus('error');
      setNotice('Please wait a moment before sending another message.');
      return;
    }
    inFlight.current = true;
    setStatus('sending');
    setNotice('');
    try {
      await sendContactMessage(draft);
      nextMessageAt = Date.now() + 30000;
      setStatus('sent');
      setDraft(emptyDraft);
      form.reset();
    } catch (error) {
      setStatus('error');
      setNotice(
        error instanceof Error
          ? error.message
          : 'Please try again, or use the direct email link below.',
      );
    } finally {
      inFlight.current = false;
    }
  };
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 3000);
    } catch {
      setNotice(
        'Select the email address below to copy it, or open it in your email app.',
      );
    }
  };

  return (
    <section className="contact-page" aria-labelledby="contact-heading">
      <header className="contact-heading">
        <div>
          <p className="eyebrow">
            <span aria-hidden="true">✳</span> LET’S CONNECT
          </p>
          <h1 id="contact-heading" ref={headingRef} tabIndex={-1}>
            A good idea starts
            <br />
            with a <em>hello.</em>
          </h1>
        </div>
        <p>
          Have a project in mind, a question,
          <br className="contact-desktop-break" /> or something worth building
          together?
          <br className="contact-desktop-break" /> I’d love to hear about it.
        </p>
      </header>
      <Reveal className="contact-studio" delay={0.14}>
        <div className="contact-form-panel">
          <div className="contact-form-title">
            <span className="eyebrow">STRAIGHT TO MY INBOX</span>
            <Send size={18} aria-hidden="true" />
          </div>
          {status === 'sent' ? (
            <div
              className="contact-success"
              ref={statusRef}
              tabIndex={-1}
              role="status"
            >
              <span className="success-icon">
                <CheckCheck size={30} />
              </span>
              <h2>Thanks for saying hello.</h2>
              <p>
                Your message has been sent. I’ll get back to you at the email
                address you shared.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setStatus('idle');
                  setTimeout(
                    () =>
                      formRef.current
                        ?.querySelector<HTMLInputElement>('input[name="name"]')
                        ?.focus(),
                    0,
                  );
                }}
              >
                Write another message <ArrowUpRight />
              </Button>
            </div>
          ) : (
            <form
              ref={formRef}
              className="contact-form"
              onSubmit={submit}
              noValidate
              aria-busy={status === 'sending'}
            >
              <div className="contact-field">
                <Label htmlFor="contact-name">
                  Your name <span>01</span>
                </Label>
                <Input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  placeholder="What should I call you?"
                  value={draft.name}
                  onChange={(event) => update('name', event.target.value)}
                  required
                  minLength={2}
                  maxLength={80}
                  disabled={status === 'sending'}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={
                    errors.name ? 'contact-name-error' : undefined
                  }
                />
                {errors.name && (
                  <p className="field-error" id="contact-name-error">
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="contact-field">
                <Label htmlFor="contact-email">
                  Email address <span>02</span>
                </Label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={draft.email}
                  onChange={(event) => update('email', event.target.value)}
                  required
                  maxLength={254}
                  disabled={status === 'sending'}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? 'contact-email-error' : undefined
                  }
                />
                {errors.email && (
                  <p className="field-error" id="contact-email-error">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="contact-field">
                <Label htmlFor="contact-message">
                  What’s on your mind? <span>03</span>
                </Label>
                <Textarea
                  id="contact-message"
                  name="message"
                  placeholder="A little about your idea, your project, or just a hello…"
                  value={draft.message}
                  onChange={(event) => update('message', event.target.value)}
                  required
                  minLength={10}
                  maxLength={5000}
                  disabled={status === 'sending'}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message ? 'contact-message-error' : undefined
                  }
                />
                {errors.message && (
                  <p className="field-error" id="contact-message-error">
                    {errors.message}
                  </p>
                )}
              </div>
              <div className="contact-trap" aria-hidden="true">
                <label htmlFor="company-website">Leave this field empty</label>
                <input
                  id="company-website"
                  name="company_website"
                  type="text"
                  autoComplete="off"
                  tabIndex={-1}
                />
              </div>
              <Button
                type="submit"
                className="contact-submit"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? (
                  <>
                    Sending your message{' '}
                    <LoaderCircle className="send-spinner" />
                  </>
                ) : (
                  <>
                    Send message <ArrowUpRight />
                  </>
                )}
              </Button>
              <p className="contact-privacy">
                Your name, email and message are sent to me through{' '}
                <a
                  href="https://www.emailjs.com/legal/privacy-policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  EmailJS
                </a>
                , so I can reply.
              </p>
            </form>
          )}
          <div
            className={`contact-notice ${status === 'error' ? 'is-error' : ''}`}
            role={status === 'error' ? 'alert' : 'status'}
          >
            {notice}
          </div>
          <div className="contact-direct">
            <span>More of an email person?</span>
            <div>
              <a href={contactMailto(draft)}>
                <Mail size={16} /> {contactEmail}
              </a>
              <Button
                variant="ghost"
                size="icon"
                aria-label={
                  copied ? 'Email address copied' : 'Copy email address'
                }
                onClick={copyEmail}
              >
                {copied ? <Check /> : <Copy />}
              </Button>
            </div>
            <span className="sr-only" role="status">
              {copied ? 'Email address copied.' : ''}
            </span>
          </div>
        </div>
        <ContactOrbit dark={dark} />
      </Reveal>
      <Reveal className="contact-links">
        <span>Different ways to say hello.</span>
        <div>
          <a
            href="https://linkedin.com/in/ajaykareer"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn <ArrowUpRight size={16} />
          </a>
          <a
            href="https://github.com/ajaykareer"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub <ArrowUpRight size={16} />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
