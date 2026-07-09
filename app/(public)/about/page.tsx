import { Heart, Leaf, Users } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - ActivBite',
  description: 'Learn about ActivBite, our mission, and our commitment to student nutrition.',
};

export default function AboutPage() {
  return (
    <>
        {/* Hero */}
        <section className="bg-secondary py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">About ActivBite</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Fueling active students with delicious, nutritious breakfast bars
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Our Story</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  ActivBite was born from a simple observation: students are busy. Between
                  classes, sports, work, and late-night study sessions, proper nutrition often
                  takes a backseat.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We created ActivBite to solve this problem. Our breakfast bars are designed
                  with students in mind—packed with protein, carbs, and natural ingredients to
                  fuel your day without compromising on taste.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To make healthy nutrition accessible and delicious for every active student,
                  enabling them to perform their best in academics, sports, and life.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Heart size={24} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Quality</h3>
                    <p className="text-muted-foreground">
                      We use only the finest natural ingredients, no artificial additives or
                      preservatives.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Leaf size={24} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Sustainability</h3>
                    <p className="text-muted-foreground">
                      We are committed to eco-friendly packaging and sustainable sourcing
                      practices.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users size={24} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Community</h3>
                    <p className="text-muted-foreground">
                      We support students and give back to the communities we serve.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-secondary">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to fuel your potential?
            </h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of students who have made ActivBite part of their daily routine.
            </p>
            <a
              href="/shop"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Shop Now
            </a>
          </div>
        </section>
    </>
  );
}
