import type { Metadata } from 'next';
import LegalPage, { type LegalSection } from '@/components/legal-page';

const LAST_UPDATED = '11 July 2026';
const SUPPORT_EMAIL = 'support@activbite.com';

export const metadata: Metadata = {
  title: 'Privacy Policy | ActivBite',
  description:
    'Privacy Policy for ActivBite waitlist, shop orders, payments, and NITK campus delivery.',
};

const quickCards = [
  {
    label: 'Who we are',
    value: 'ActivBite, a registered partnership firm based in Kundapura, Karnataka, India.',
  },
  {
    label: 'What we sell',
    value: 'ActivBite Breakfast Bars, currently sold in packs of 5, 10, 20, and 30.',
  },
  {
    label: 'Current delivery',
    value: 'First launch delivery is limited to National Institute of Technology Karnataka.',
  },
];

const sections: LegalSection[] = [
  {
    title: 'Scope of this policy',
    body: (
      <p>
        This Privacy Policy applies to ActivBite&apos;s website, waitlist forms,
        shop page, order support, payment flow, and campus delivery operations.
      </p>
    ),
  },
  {
    title: 'Information we collect',
    body: (
      <>
        <p>
          We collect only the information needed to operate ActivBite and serve
          customers. This may include:
        </p>
        <ul>
          <li>Email address submitted through the coming soon or waitlist form.</li>
          <li>Name, phone number, and campus delivery address when orders are enabled.</li>
          <li>
            Order details such as selected pack size, quantity, order value, payment
            status, and delivery status.
          </li>
          <li>Messages, complaints, support requests, or delivery issue reports sent to us.</li>
          <li>
            Basic website usage and device information that helps us keep the website
            secure and working properly.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Payments',
    body: (
      <p>
        Payments on the shop page may use UPI QR/manual verification or another
        authorised payment partner. ActivBite does not store full card numbers, UPI
        PINs, net banking passwords, or other sensitive payment credentials on its website.
      </p>
    ),
  },
  {
    title: 'How we use information',
    body: (
      <ul>
        <li>To notify waitlist users about ActivBite launch updates.</li>
        <li>To confirm, process, and deliver orders within NITK campus.</li>
        <li>To contact customers about delivery, support, refunds, or replacements.</li>
        <li>To improve our product, website, packaging, and customer experience.</li>
        <li>To prevent fraud, secure our website, and comply with applicable law.</li>
      </ul>
    ),
  },
  {
    title: 'Sharing of information',
    body: (
      <p>
        We do not sell personal information. We may share limited information only
        when required for normal operations, such as with payment partners,
        website/service providers, delivery or support helpers, accounting or
        compliance support, or legal authorities when required by law.
      </p>
    ),
  },
  {
    title: 'Data storage and retention',
    body: (
      <p>
        We keep personal information only for as long as reasonably needed for
        waitlist communication, order fulfilment, customer support, business records,
        accounting, legal compliance, and dispute resolution. Customers may request
        deletion where applicable by contacting us.
      </p>
    ),
  },
  {
    title: 'Customer choices and requests',
    body: (
      <p>
        You may contact us to request access, correction, update, or deletion of your
        personal information, or to withdraw consent for non-essential communications.
        We may need to retain some information where required for completed orders,
        legal records, payment disputes, or fraud prevention.
      </p>
    ),
  },
  {
    title: 'Children’s privacy',
    body: (
      <p>
        ActivBite is not intended to knowingly collect personal data from children
        without appropriate guardian consent. If you believe a child has shared
        personal data with us, please contact us and we will review the request.
      </p>
    ),
  },
  {
    title: 'Cookies and website security',
    body: (
      <p>
        We may use essential cookies, logs, or similar technologies to run the
        website, remember basic preferences, measure page performance, and protect
        against misuse. No internet system is perfectly secure, but we use reasonable
        safeguards to protect customer information.
      </p>
    ),
  },
  {
    title: 'Updates to this policy',
    body: (
      <p>
        We may update this Privacy Policy as ActivBite grows, launches new services,
        or changes how orders and delivery work. The latest version will be posted on
        this page with the updated date.
      </p>
    ),
  },
  {
    title: 'Contact us',
    highlight: true,
    body: (
      <>
        <p>
          For privacy questions or data requests, contact ActivBite at{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
        </p>
        <p>Business location: Kundapura, Karnataka, India.</p>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="A simple explanation of what ActivBite collects, why we collect it, how payments are handled, and how customers can contact us about their data."
      lastUpdated={LAST_UPDATED}
      quickCards={quickCards}
      sections={sections}
      activeLabel="Privacy"
      alternateHref="/terms"
      alternateLabel="Terms"
    />
  );
}
