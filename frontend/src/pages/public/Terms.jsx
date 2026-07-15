import LegalPage from "./LegalPage";

const SECTIONS = [
  {
    heading: "1. Acceptance of terms",
    body: "By creating an account or using CareerNexus, you agree to be bound by these Terms of Service and our Privacy Policy.",
  },
  {
    heading: "2. Eligibility",
    body: "You must be at least 16 years old to create a student account, and recruiters must represent a legitimate hiring organization.",
  },
  {
    heading: "3. Acceptable use",
    body: "You agree not to misrepresent your identity, post fraudulent job listings, scrape the platform, or use CareerNexus for any unlawful purpose.",
  },
  {
    heading: "4. Recruiter verification",
    body: "Recruiter accounts are subject to a manual review process. We reserve the right to suspend accounts that violate our hiring standards.",
  },
  {
    heading: "5. Intellectual property",
    body: "All platform content, branding, and underlying technology are owned by CareerNexus. Your resume and profile content remain your own.",
  },
  {
    heading: "6. Termination",
    body: "We may suspend or terminate accounts that violate these terms. You may close your account at any time from Settings.",
  },
  {
    heading: "7. Limitation of liability",
    body: "CareerNexus is provided 'as is'. We do not guarantee employment outcomes and are not liable for hiring decisions made by third-party recruiters.",
  },
];

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      updatedAt="July 1, 2026"
      sections={SECTIONS}
    />
  );
}
