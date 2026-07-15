import LegalPage from "./LegalPage";

const SECTIONS = [
  {
    heading: "1. Information we collect",
    body: "We collect information you provide directly, such as your name, email, resume content, and application activity, along with usage data collected automatically to improve the platform.",
  },
  {
    heading: "2. How we use your information",
    body: "We use your information to power job matching, operate your account, communicate updates, and improve our AI matching models over time.",
  },
  {
    heading: "3. Sharing with recruiters",
    body: "When you apply to a job, relevant profile and resume information is shared with that recruiter. We never sell your personal data to third parties.",
  },
  {
    heading: "4. Data retention",
    body: "We retain your data for as long as your account is active. You can request deletion of your account and associated data at any time from Settings.",
  },
  {
    heading: "5. Your rights",
    body: "You may access, correct, export, or delete your personal data. Contact our support team for any requests outside of the self-serve tools.",
  },
  {
    heading: "6. Security",
    body: "We use industry-standard encryption in transit and at rest, and restrict internal access to personal data on a need-to-know basis.",
  },
  {
    heading: "7. Changes to this policy",
    body: "We'll notify you of material changes to this policy by email or an in-app notice before they take effect.",
  },
];

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      updatedAt="July 1, 2026"
      sections={SECTIONS}
    />
  );
}
