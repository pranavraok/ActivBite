import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage, { type LegalSection } from '@/components/legal-page';

const LAST_UPDATED = '11 July 2026';
const SUPPORT_EMAIL = 'support@activbite.com';

export const metadata: Metadata = {
  title: 'Terms & Conditions | ActivBite',
  description:
    'Terms and Conditions for buying ActivBite Breakfast Bars through the ActivBite shop.',
};

const quickCards = [
  {
    label: 'Product',
    value: 'ActivBite Breakfast Bars available in packs of 10, 20, and 30.',
  },
  {
    label: 'Price',
    value: '₹40 per bar: ₹400, ₹800, and ₹1,200 respectively.',
  },
  {
    label: 'Delivery',
    value: 'First launch delivery is limited to NITK campus.',
  },
];

const sections: LegalSection[] = [
  {
    title: 'Acceptance of terms',
    body: (
      <p>
        By accessing activbite.com, joining our waitlist, placing an order, or using
        the ActivBite shop page, you agree to these Terms & Conditions and our{' '}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>
    ),
  },
  {
    title: 'About ActivBite',
    body: (
      <p>
        ActivBite is a registered partnership firm based in Kundapura, Karnataka,
        India. The website is operated for ActivBite&apos;s breakfast bar brand and
        related customer support.
      </p>
    ),
  },
  {
    title: 'Product information',
    body: (
      <>
        <p>
          ActivBite currently offers one product: ActivBite Breakfast Bar. The bar is
          sold through the shop page in packs of 10, 20, and 30. Product details,
          prices, nutrition highlights, ingredients, packaging, and availability may
          be updated from time to time.
        </p>
        <p>
          Nutrition highlights shown on the website, such as 300 kcal, 9.3g protein,
          and 6.5g fibre, are product information and not medical advice. ActivBite
          is a food product and is not intended to diagnose, treat, cure, or prevent
          any medical condition.
        </p>
      </>
    ),
  },
  {
    title: 'Ingredients and allergen notice',
    body: (
      <>
        <p>
          ActivBite Breakfast Bar contains or is made using ingredients such as oats,
          peanuts, dates, poha, jaggery, elaichi, and chocolate. The product may not
          be suitable for people with allergies or sensitivities to peanuts, nuts,
          cereals, milk, soy, chocolate, or other ingredients used in food production.
        </p>
        <p>
          Customers should read the product label before consumption. If you have a
          severe allergy, dietary restriction, or medical concern, please avoid
          consuming the product unless you are satisfied that it is safe for you.
        </p>
      </>
    ),
  },
  {
    title: 'Orders and payments',
    body: (
      <ul>
        <li>Orders are placed from the ActivBite shop page.</li>
        <li>Payments are handled through Cashfree or another authorised payment partner.</li>
        <li>An order is confirmed only after successful payment confirmation.</li>
        <li>
          Prices are shown in Indian Rupees. Any applicable taxes, fees, or changes
          will be shown before payment where required.
        </li>
        <li>
          If a payment is debited but the order is not confirmed, contact us with
          payment proof so we can verify it with the payment partner.
        </li>
      </ul>
    ),
  },
  {
    title: 'Campus delivery',
    body: (
      <>
        <p>
          During the first launch phase, ActivBite delivery is limited to National
          Institute of Technology Karnataka (NITK). The customer must provide
          accurate name, phone number, and campus delivery address or pickup details.
          Delivery timelines are estimates and may vary because of campus access,
          availability, weather, events, or operational reasons.
        </p>
        <p>
          ActivBite currently offers free delivery on your campus unless stated
          otherwise on the shop page.
        </p>
      </>
    ),
  },
  {
    title: 'Delivery issue, replacement, and refund policy',
    body: (
      <>
        <p>
          Because ActivBite sells a packaged food product, returns are limited. Any
          issue such as wrong pack, missing quantity, damaged pack, broken seal, or
          visible quality concern must be reported during delivery itself.
        </p>
        <p>
          If a valid issue is reported during delivery, ActivBite may offer a
          correction, replacement, or refund depending on the situation. Once an
          order is accepted at delivery, it is generally not eligible for return or
          refund unless required by applicable law.
        </p>
      </>
    ),
  },
  {
    title: 'Availability and changes',
    body: (
      <p>
        Product availability, pack sizes, prices, offers, and delivery coverage may
        change. We try to keep the website accurate, but mistakes can happen. If
        there is an obvious pricing or product error, ActivBite may cancel or correct
        the affected order and inform the customer.
      </p>
    ),
  },
  {
    title: 'Website use',
    body: (
      <p>
        Customers must use the website lawfully and must not misuse the shop, payment
        flow, forms, brand assets, or website code. ActivBite may block or cancel
        activity that appears fraudulent, abusive, automated, or harmful to the
        website or customers.
      </p>
    ),
  },
  {
    title: 'Intellectual property',
    body: (
      <p>
        The ActivBite name, logo, product visuals, website design, text, packaging
        concepts, and brand materials belong to ActivBite or its licensors. They may
        not be copied or used without permission except as allowed by law.
      </p>
    ),
  },
  {
    title: 'Limitation of liability',
    body: (
      <p>
        To the maximum extent permitted by law, ActivBite is not liable for indirect,
        incidental, special, or consequential losses arising from website use, delayed
        delivery, payment partner issues, or product misuse. Nothing in these terms
        limits any customer rights that cannot be excluded under applicable law.
      </p>
    ),
  },
  {
    title: 'Governing law',
    body: (
      <p>
        These Terms & Conditions are governed by the laws of India. Disputes will be
        subject to the jurisdiction of competent courts in Karnataka, India, unless
        applicable law requires otherwise.
      </p>
    ),
  },
  {
    title: 'Updates to terms',
    body: (
      <p>
        ActivBite may update these Terms & Conditions as the brand starts operations,
        expands delivery, adds products, or changes payment and support processes.
        The latest version will be posted on this page.
      </p>
    ),
  },
  {
    title: 'Contact us',
    highlight: true,
    body: (
      <>
        <p>
          For order, delivery, refund, or terms-related questions, contact ActivBite
          at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
        </p>
        <p>Business location: Kundapura, Karnataka, India.</p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      intro="A clear, customer-friendly agreement for ActivBite Breakfast Bar purchases, NITK campus delivery, issue reporting, and secure payment handling."
      lastUpdated={LAST_UPDATED}
      quickCards={quickCards}
      sections={sections}
      activeLabel="Terms"
      alternateHref="/privacy-policy"
      alternateLabel="Privacy"
    />
  );
}
