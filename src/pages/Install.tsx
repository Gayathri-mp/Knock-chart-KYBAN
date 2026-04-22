import { ArrowLeft, Download, MonitorSmartphone, Share2, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

const installGuides = [
  {
    title: 'iPhone / iPad',
    icon: Share2,
    steps: ['Open this app in Safari.', 'Tap the Share button.', 'Choose “Add to Home Screen”.', 'Tap “Add” to install it.'],
  },
  {
    title: 'Android',
    icon: Download,
    steps: ['Open this app in Chrome.', 'Tap the browser menu.', 'Choose “Install app” or “Add to Home screen”.', 'Confirm to install it.'],
  },
];

const Install = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        <div className="grid flex-1 gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                <MonitorSmartphone className="h-4 w-4" />
                Installable mobile app
              </div>
              <h1 className="font-heading text-4xl font-bold leading-none sm:text-5xl">
                Install Knockout Bracket on your phone
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                Use the same bracket experience on mobile, directly from your home screen, without changing the core app.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {installGuides.map(({ title, icon: Icon, steps }) => (
                <article key={title} className="rounded-lg border border-border bg-card p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-secondary p-2 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="font-heading text-2xl font-bold">{title}</h2>
                  </div>
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    {steps.map((step, index) => (
                      <li key={step} className="flex gap-3">
                        <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-lg border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-secondary p-2 text-accent">
                <Smartphone className="h-5 w-5" />
              </div>
              <h2 className="font-heading text-2xl font-bold">What you get</h2>
            </div>

            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Full-screen app feel from the home screen</li>
              <li>Fast access to bracket editing during matches</li>
              <li>One shared codebase for desktop and mobile browsers</li>
            </ul>

            <div className="mt-6 rounded-lg border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
              Tip: use the phone/tablet preview toggle above the canvas to test the mobile layout inside Lovable.
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default Install;