


import Footer from '@/components/footer';
import Header from '@/components/header';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-secondary py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Terms and Conditions
            </h1>
            <p className="text-muted-foreground">Last updated: January 2024</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-sm max-w-none">
            <div className="space-y-8 text-muted-foreground">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  1. Terms and Conditions of Use
                </h2>
                <p>
                  These Terms and Conditions (&quot;Agreement&quot;) constitute a legal agreement
                  between you and ActivBite. By accessing and using this website, you accept and
                  agree to be bound by the terms and provision of this agreement.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  2. Use License
                </h2>
                <p>
                  Permission is granted to temporarily download one copy of the materials
                  (information or software) on ActivBite&apos;s website for personal,
                  non-commercial transitory viewing only.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  3. Disclaimer
                </h2>
                <p>
                  The materials on ActivBite&apos;s website are provided &quot;as is&quot;.
                  ActivBite makes no warranties, expressed or implied, and hereby disclaims and
                  negates all other warranties including, without limitation, implied warranties
                  or conditions of merchantability, fitness for a particular purpose, or
                  non-infringement of intellectual property or other violation of rights.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  4. Limitations of Liability
                </h2>
                <p>
                  In no event shall ActivBite or its suppliers be liable for any damages
                  (including, without limitation, damages for loss of data or profit, or due to
                  business interruption) arising out of the use or inability to use the materials
                  on ActivBite&apos;s website, even if ActivBite or an authorized representative
                  has been notified orally or in writing of the possibility of such damage.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  5. Product Information
                </h2>
                <p>
                  We strive to provide accurate product descriptions and prices. However, we do
                  not warrant that product descriptions, pricing, or other content of the website
                  is accurate, complete, reliable, current, or error-free.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  6. Return and Refund Policy
                </h2>
                <p>
                  We offer a 7-day money-back guarantee on all products. If you are not satisfied
                  with your purchase, please contact our support team with proof of purchase
                  within 7 days for a refund or replacement.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  7. Modifications
                </h2>
                <p>
                  ActivBite may revise these terms of service for its website at any time without
                  notice. By using this website, you are agreeing to be bound by the then current
                  version of these terms of service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  8. Governing Law
                </h2>
                <p>
                  These terms and conditions are governed by and construed in accordance with the
                  laws of India, and you irrevocably submit to the exclusive jurisdiction of the
                  courts in that location.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">9. Contact Us</h2>
                <p>
                  If you have any questions about these Terms and Conditions, please contact us
                  at:
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
