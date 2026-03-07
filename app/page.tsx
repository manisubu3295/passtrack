import Image from 'next/image';
import { EarlyAccessForm } from '@/components/early-access-form';
import { EarlyAccessPopup } from '@/components/early-access-popup';
import { DashboardMockup } from '@/components/dashboard-mockup';
import { LaunchAnnouncement } from '@/components/launch-announcement';
import { FadeUp, MotionButtonLink, SlideInCard } from '@/components/motion-primitives';

const painPoints = [
  'Manual spreadsheets',
  'Missed renewal deadlines',
  'Compliance stress',
  'MOM penalty risks',
];

const benefits = [
  {
    title: 'Centralized pass tracking',
    description: 'Keep EP, S Pass and Work Permit records in one secure workspace.',
  },
  {
    title: 'Automatic expiry reminders',
    description: 'Receive timely alerts before renewals become urgent compliance issues.',
  },
  {
    title: 'Clear visibility for HR teams',
    description: 'See what is expiring next across teams without manual follow-ups.',
  },
];

const capabilities = [
  {
    icon: '🗓️',
    title: 'Work Pass Expiry Tracking',
    description:
      'Track Employment Pass, S Pass and Work Permit expiry dates in one dashboard.',
  },
  {
    icon: '🔔',
    title: 'Automatic Renewal Alerts',
    description:
      'Receive reminders before passes expire to avoid compliance issues.',
  },
  {
    icon: '📊',
    title: 'Compliance Dashboard',
    description: 'See expiring, renewed and pending passes at a glance.',
  },
  {
    icon: '👥',
    title: 'Workforce Pass Management',
    description: 'Manage employee pass records in one central system.',
  },
  {
    icon: '🔒',
    title: 'Secure HR Access',
    description: 'Role-based access for HR teams managing pass information.',
  },
];

export default function HomePage() {
  return (
    <main className="bg-transparent text-slate-900">
      <EarlyAccessPopup />
      <LaunchAnnouncement />

      <section className="section-fade border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-[60px] lg:py-20">
          <div className="section-shell grid gap-8 overflow-hidden px-4 py-5 sm:px-6 sm:py-6 md:grid-cols-2 md:items-center md:gap-10 md:px-10 md:py-10 lg:gap-12">
            <div>
              <FadeUp>
                <span className="hero-kicker">
                  <Image
                    src="/passtrack-logo.jpeg"
                    alt="PassTrack logo"
                    width={20}
                    height={20}
                    className="rounded-sm object-cover"
                  />
                  Built for Singapore HR Operations
                </span>
              </FadeUp>
            <FadeUp delay={0.05}>
              <h1 className="mt-4 text-[2rem] font-bold leading-[1.08] tracking-[-0.02em] text-primary sm:text-4xl md:text-5xl lg:text-[56px]">
                Never Miss a Work Pass Renewal Again
              </h1>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                A smarter way for Singapore companies to track Employment Pass, S Pass and Work
                Permit expiries.
              </p>
            </FadeUp>
            <MotionButtonLink
              href="#early-access"
              className="mt-7 inline-flex w-full items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600 sm:w-auto"
            >
              Request Early Access
            </MotionButtonLink>
            <p className="mt-3 text-sm font-semibold text-accent">
              Special launch offer: $10/month for the first 100 business owners and HR managers.
            </p>
            </div>
            <FadeUp delay={0.2}>
              <DashboardMockup />
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="section-fade-delay border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-[60px] lg:py-20">
          <div className="section-shell px-4 py-5 sm:px-6 sm:py-6 md:px-10 md:py-10">
            <h2 className="text-xl font-semibold leading-tight tracking-[-0.01em] text-primary sm:text-2xl md:text-[32px]">
              Most companies still track work passes in Excel.
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {painPoints.map((point, index) => (
                <SlideInCard
                  key={point}
                  className="glass-card-soft rounded-xl p-5"
                  delay={index * 0.08}
                  horizontalDrift
                >
                  <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-xs font-semibold text-slate-700">
                    0{index + 1}
                  </div>
                  <p className="text-base font-medium leading-7 text-slate-700">{point}</p>
                </SlideInCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-fade-delay border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-[60px] lg:py-20">
          <div className="section-shell px-4 py-5 sm:px-6 sm:py-6 md:px-10 md:py-10">
            <h2 className="text-xl font-semibold leading-tight tracking-[-0.01em] text-primary sm:text-2xl md:text-[32px]">
              PassTrack simplifies work pass management.
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {benefits.map((benefit, index) => (
                <SlideInCard
                  key={benefit.title}
                  className="glass-card rounded-xl p-6"
                  delay={index * 0.1}
                >
                  <div className="text-sm font-semibold text-accent">Benefit 0{index + 1}</div>
                  <p className="mt-2 text-lg font-semibold leading-8 text-slate-900">{benefit.title}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{benefit.description}</p>
                </SlideInCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-fade-delay border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-[60px] lg:py-20">
          <div className="section-shell px-4 py-5 sm:px-6 sm:py-6 md:px-10 md:py-10">
            <h2 className="text-xl font-semibold leading-tight tracking-[-0.01em] text-primary sm:text-2xl md:text-[32px]">
              Everything HR needs to manage work passes
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((item, index) => (
                <SlideInCard
                  key={item.title}
                  className="glass-card rounded-xl p-5"
                  delay={index * 0.08}
                >
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/60 bg-white/70 text-base shadow-[0_10px_20px_rgba(15,23,42,0.08)]">
                    {item.icon}
                  </div>
                  <p className="mt-4 text-base font-semibold leading-7 text-slate-900">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                </SlideInCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="early-access" className="section-fade-delay border-b border-slate-200">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-2 md:py-[60px] lg:py-20">
          <div className="section-shell px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8">
            <h2 className="text-xl font-semibold leading-tight tracking-[-0.01em] text-primary sm:text-2xl md:text-[32px]">
              Join the Early Access Program
            </h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
              We are inviting Singapore HR teams to try PassTrack before public launch.
            </p>
            <div className="mt-5 inline-flex rounded-full border border-red-100 bg-red-50/80 px-3 py-1 text-xs font-medium text-accent">
              Limited onboarding slots for first cohort
            </div>
            <p className="mt-4 text-sm font-semibold text-accent">
              $10/month for the first 100 business owners and HR managers.
            </p>
          </div>
          <EarlyAccessForm />
        </div>
      </section>

      <section className="section-fade-delay border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-[60px] lg:py-20">
          <div className="section-shell px-4 py-5 sm:px-6 sm:py-6 md:px-10 md:py-10">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Trust</p>
            <h3 className="mt-3 text-xl font-semibold leading-tight tracking-[-0.01em] text-primary sm:text-2xl md:text-[32px]">
              Built for companies operating in Singapore.
            </h3>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-medium text-slate-700">
              <span className="glass-card-soft rounded-md px-3 py-2">EP</span>
              <span className="glass-card-soft rounded-md px-3 py-2">S Pass</span>
              <span className="glass-card-soft rounded-md px-3 py-2">Work Permit</span>
              <span className="glass-card-soft rounded-md px-3 py-2 text-accent">🇸🇬 Singapore</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative bg-slate-50">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://wa.me/6590356479?text=Hi%20PassTrack%2C%20I%20have%20an%20enquiry."
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-slate-900"
            >
              Contact on WhatsApp
            </a>
          </div>
          <div className="flex items-center gap-2 md:justify-end">
            <Image
              src="/passtrack-logo.jpeg"
              alt="PassTrack logo"
              width={24}
              height={24}
              className="rounded-sm object-cover"
            />
            <p>© PassTrack Singapore</p>
          </div>
        </div>

        <a
          href="/api/admin/leads"
          target="_blank"
          rel="noreferrer"
          aria-label="Admin leads JSON"
          className="absolute bottom-2 right-2 inline-flex h-2.5 w-2.5 items-center justify-center rounded-full bg-slate-500 opacity-10 transition hover:opacity-60"
        />
      </footer>

      <a
        href="https://wa.me/6590356479?text=Hi%20PassTrack%2C%20I%20have%20an%20enquiry."
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp enquiry"
        className="fixed bottom-4 left-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_28px_rgba(37,211,102,0.35)] transition hover:scale-105 hover:shadow-[0_16px_30px_rgba(37,211,102,0.4)]"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
          <path d="M12.04 2c-5.52 0-10 4.47-10 10 0 1.77.47 3.49 1.36 5.01L2 22l5.13-1.34A9.98 9.98 0 0 0 12.04 22c5.52 0 10-4.47 10-10s-4.48-10-10-10Zm0 18.19a8.13 8.13 0 0 1-4.14-1.13l-.3-.18-3.04.8.81-2.97-.2-.31a8.12 8.12 0 1 1 6.87 3.79Zm4.45-6.08c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1-.37-1.91-1.18-.7-.63-1.17-1.4-1.31-1.64-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.31-.74-1.79-.2-.48-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.59 4.12 3.63.58.25 1.03.4 1.38.52.58.18 1.1.15 1.52.09.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
        </svg>
      </a>
    </main>
  );
}
