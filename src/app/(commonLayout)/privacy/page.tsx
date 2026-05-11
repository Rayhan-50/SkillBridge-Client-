import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Shield } from "lucide-react";

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly, including name, email, profile photo, and payment information. We also automatically collect usage data such as pages visited, session duration, and device information to improve our services.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `Your information is used to provide and improve our tutoring marketplace, process payments, send transactional emails, personalize your experience, prevent fraud, and comply with legal obligations. We never sell your personal data to third parties.`,
  },
  {
    title: "3. Information Sharing",
    content: `We share data only with: (a) tutors/students as needed for sessions you book, (b) payment processors (Stripe) for secure transactions, (c) service providers who help us operate SkillBridge under strict confidentiality agreements, and (d) legal authorities when required by law.`,
  },
  {
    title: "4. Data Security",
    content: `We use industry-standard encryption (TLS 1.3) for all data in transit and AES-256 for data at rest. Payment data is handled exclusively by PCI-DSS compliant processors. We conduct regular security audits and penetration testing.`,
  },
  {
    title: "5. Your Rights",
    content: `You have the right to access, correct, or delete your personal data at any time from your account settings. You may also request a full data export, opt out of marketing communications, or request account deletion. GDPR and CCPA rights are fully respected.`,
  },
  {
    title: "6. Cookies",
    content: `We use essential cookies for authentication and session management, and optional analytics cookies to improve our platform. You can control cookie preferences in your browser settings. Disabling cookies may affect some platform functionality.`,
  },
  {
    title: "7. Third-Party Services",
    content: `SkillBridge integrates with Stripe (payments), Google (OAuth), and analytics providers. Each has their own privacy policy. We recommend reviewing their policies for complete information on how they handle your data.`,
  },
  {
    title: "8. Children's Privacy",
    content: `SkillBridge is not directed at children under 13. We do not knowingly collect data from children under 13. If you believe a child has provided us with personal information, please contact us immediately at privacy@skillbridge.io.`,
  },
  {
    title: "9. Changes to This Policy",
    content: `We may update this Privacy Policy periodically. We will notify you of significant changes via email or a prominent notice on our platform at least 30 days before they take effect. Continued use of SkillBridge constitutes acceptance of the updated policy.`,
  },
  {
    title: "10. Contact Us",
    content: `For privacy-related questions or requests, contact our Data Protection Officer at privacy@skillbridge.io or by mail at: SkillBridge Inc., 450 Serra Mall, Palo Alto, CA 94305, USA.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="relative py-20 hero-gradient overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 orb-teal opacity-20" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full border border-primary/20 mb-6">
              <Shield className="w-4 h-4" /> Privacy & Trust
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black mb-4">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Last updated: May 1, 2025. We&apos;re committed to protecting your privacy and being transparent about how we handle your data.
            </p>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="glass-card rounded-3xl p-8 md:p-12 mb-8">
                <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-primary pl-4">
                  This Privacy Policy explains how SkillBridge Inc. (&quot;SkillBridge&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and protects your personal information when you use our tutoring marketplace platform at skillbridge.io.
                </p>
              </div>

              <div className="space-y-8">
                {sections.map((section) => (
                  <div key={section.title} className="glass-card rounded-2xl p-6 md:p-8">
                    <h2 className="font-display font-bold text-lg mb-4 text-foreground">{section.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
    </>
  );
}
