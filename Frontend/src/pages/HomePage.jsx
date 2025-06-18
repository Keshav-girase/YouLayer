import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function HomePage() {
  return (
    <div className="bg-background text-foreground px-4 lg:px-0">
      <Helmet>
        <title>YouLayer – Secure YouTube Publishing</title>
      </Helmet>

      {/* Hero */}
      <section className="py-24 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Secure Team-Based YouTube Publishing
        </h1>
        <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
          YouLayer is your secure workflow for uploading, reviewing, and publishing YouTube videos —
          built for creators, managers, and agencies.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button asChild size="lg">
            <Link to="signup">
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="#features">Explore Features</a>
          </Button>
        </div>
        <div className="">
          <img
            src="/image.png"
            alt="YouLayer Dashboard"
            className="mt-12 mx-auto rounded-2xl shadow-lg max-w-4xl w-full dark:border p-2"
          />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-card">
        <h2 className="text-3xl font-bold text-center mb-16 text-foreground">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {[
            {
              icon: 'https://img.icons8.com/ios-filled/50/security-checked.png',
              title: 'Secure YouTube Uploads',
              desc: 'OAuth + AES encryption + review system = no unauthorized access.',
            },
            {
              icon: 'https://img.icons8.com/ios-filled/50/edit--v1.png',
              title: 'Video Review & Edit',
              desc: 'Edit titles, tags, descriptions before approval by creator.',
            },
            {
              icon: 'https://img.icons8.com/ios-filled/50/combo-chart--v1.png',
              title: 'Dashboard & Analytics',
              desc: 'Track performance and manage drafts in one place.',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-8 bg-background rounded-xl border shadow-sm flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-muted">
                <img src={feature.icon} alt={feature.title} className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-card">
        <h2 className="text-3xl font-bold text-center mb-16 text-foreground">
          How YouLayer Solves the Team Publishing Problem
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto text-center">
          {[
            {
              step: '1',
              title: 'No More Risky Sharing',
              desc: 'Team members like editors and managers upload video drafts securely on YouLayer—no YouTube credentials shared.',
              icon: 'https://img.icons8.com/ios-filled/80/user-shield.png',
            },
            {
              step: '2',
              title: 'Creator Controls Everything',
              desc: 'Creators get notified instantly, review uploads, edit metadata, and decide what goes live — full control, zero surprises.',
              icon: 'https://img.icons8.com/ios-filled/80/approval.png',
            },
            {
              step: '3',
              title: 'One-Click Secure Publishing',
              desc: 'Approved videos are published to YouTube via API with AES-encrypted tokens. No manual uploads, no security gaps.',
              icon: 'https://img.icons8.com/ios-filled/80/upload-to-cloud.png',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-8 bg-background rounded-xl border shadow-sm flex flex-col items-center"
            >
              <div className="w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-muted">
                <img src={item.icon} alt={item.title} className="w-10 h-10" />
              </div>
              <div className="text-xl font-semibold text-foreground mb-1">Step {item.step}</div>
              <h4 className="text-lg font-medium text-foreground mb-2">{item.title}</h4>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-card">
        <h2 className="text-3xl font-bold text-center mb-16 text-foreground">
          Built for Every YouTube Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto text-center">
          {['Creators', 'Managers', 'Agencies', 'Teams'].map((role, i) => (
            <div
              key={i}
              className="p-8 bg-background rounded-xl border border-muted shadow-sm flex flex-col items-center transition-transform hover:scale-[1.03] hover:shadow-md"
            >
              <h3 className="text-xl font-semibold mb-4 text-foreground">{role}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                {role === 'Creators'
                  ? 'Focus on approval, not uploading.'
                  : role === 'Managers'
                    ? 'Handle uploads without channel access.'
                    : role === 'Agencies'
                      ? 'Manage client content securely.'
                      : 'Collaborate with ease.'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {/* <section className="py-24">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
          {[
            {
              quote: "YouLayer made our publishing workflow secure and simple. Total game-changer!",
              name: "Alex, Creator",
            },
            {
              quote: "Managing multiple YouTube clients has never been this smooth. Love it!",
              name: "Priya, Manager",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="bg-background border rounded-xl p-6 shadow-sm w-full md:w-1/2"
            >
              <p className="mb-4 italic">“{t.quote}”</p>
              <div className="font-semibold">— {t.name}</div>
            </div>
          ))}
        </div>
      </section> */}

      {/* FAQ */}
      {/* <section className="py-24 bg-card">
        <h2 className="text-3xl font-bold text-center mb-12">FAQ</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h4 className="text-xl font-semibold mb-2">Is YouLayer free?</h4>
            <p className="text-muted-foreground">
              Yes, YouLayer is completely free during our beta testing period.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">Do managers need a YouTube account?</h4>
            <p className="text-muted-foreground">
              No, only creators connect their YouTube accounts. Managers just upload drafts.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">Can I revoke a team member’s access?</h4>
            <p className="text-muted-foreground">
              Yes, creators can invite or remove managers anytime from the dashboard.
            </p>
          </div>
        </div>
      </section> */}

      {/* Final CTA */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to simplify your YouTube workflow?</h2>
        <Button asChild size="lg">
          <Link to="/signup">
            Start Now <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </Button>
      </section>

      {/* Footer */}
      {/* <footer className="py-10 border-t bg-background text-muted-foreground text-sm text-center">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span>&copy; {new Date().getFullYear()} YouLayer. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/docs" className="hover:underline">Docs</Link>
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <Link to="/terms" className="hover:underline">Terms</Link>
            <a href="mailto:support@youlayer.com" className="hover:underline">Contact</a>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
