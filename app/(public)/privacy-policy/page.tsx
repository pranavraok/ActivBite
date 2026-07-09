


import Footer from '@/components/footer';
import Header from '@/components/header';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-secondary py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: January 2024</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-sm max-w-none">
            <div className="space-y-8 text-muted-foreground">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">1. Introduction</h2>
                <p>
                  ActivBite (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the
                  website. This page informs you of our policies regarding the collection, use,
                  and disclosure of personal data when you use our website and the choices you
                  have associated with that data.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  2. Information Collection and Use
                </h2>
                <p>We collect several different types of information for various purposes:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Personal data (name, email, phone number, address)</li>
                  <li>Payment information (processed securely through third parties)</li>
                  <li>Usage data (pages visited, time spent, etc.)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  3. Use of Data
                </h2>
                <p>ActivBite uses the collected data for various purposes:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>To provide and maintain our service</li>
                  <li>To notify you about changes to our service</li>
                  <li>To allow you to participate in interactive features of our service</li>
                  <li>To provide customer support</li>
                  <li>To gather analysis or valuable information so we can improve our service</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  4. Security of Data
                </h2>
                <p>
                  The security of your data is important to us but remember that no method of
                  transmission over the Internet or method of electronic storage is 100% secure.
                  While we strive to use commercially acceptable means to protect your personal
                  data, we cannot guarantee its absolute security.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  5. Changes to This Privacy Policy
                </h2>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any
                  changes by posting the new Privacy Policy on this page and updating the
                  &quot;Last updated&quot; date at the top of this Privacy Policy.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">6. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <p className="mt-3">
                  <a href="mailto:hello@activbite.com" className="text-primary hover:underline">
                    hello@activbite.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
