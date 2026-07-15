import { useState } from "react";
import Accordion from "../../components/common/Accordion";
import SearchInput from "../../components/common/SearchInput";
import EmptyState from "../../components/common/EmptyState";
import Tabs from "../../components/common/Tabs";

const CATEGORIES = {
  general: [
    {
      key: "g1",
      question: "What is CareerNexus?",
      answer:
        "CareerNexus is an AI-powered hiring platform that matches students to jobs based on skills and experience, and gives recruiters a complete pipeline to manage applicants.",
    },
    {
      key: "g2",
      question: "Is it free to use?",
      answer:
        "Creating a student profile and applying to jobs is completely free. Recruiters can post their first job free and choose a paid plan for more volume.",
    },
    {
      key: "g3",
      question: "Which regions do you support?",
      answer:
        "We currently focus on hiring across India, with companies and candidates from other regions onboarding steadily.",
    },
  ],
  students: [
    {
      key: "s1",
      question: "How is my match score calculated?",
      answer:
        "We compare your skills, experience level, and stated preferences against each job's requirements using a weighted scoring model.",
    },
    {
      key: "s2",
      question: "Can I apply without a resume?",
      answer:
        "You can build a profile without uploading a file, but most recruiters expect a resume, so we strongly recommend adding one.",
    },
    {
      key: "s3",
      question: "How do I track my applications?",
      answer:
        "Your Applications page shows every application's current stage, from Applied through to Offered or Rejected.",
    },
  ],
  recruiters: [
    {
      key: "r1",
      question: "How do I get verified?",
      answer:
        "After registering, our team reviews your company details, typically within one business day, before your first job can go live.",
    },
    {
      key: "r2",
      question: "Can multiple team members share an account?",
      answer:
        "Team collaboration is available on the Growth and Enterprise plans.",
    },
    {
      key: "r3",
      question: "How does the interview scheduler work?",
      answer:
        "You can propose time slots directly on a candidate's application, and they'll receive a notification to confirm.",
    },
  ],
};

export default function FAQ() {
  const [query, setQuery] = useState("");

  const filterItems = (items) =>
    items.filter(
      (i) =>
        i.question.toLowerCase().includes(query.toLowerCase()) ||
        i.answer.toLowerCase().includes(query.toLowerCase()),
    );

  const tabs = Object.entries(CATEGORIES).map(([key, items]) => {
    const filtered = filterItems(items);
    return {
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      content: filtered.length ? (
        <Accordion items={filtered} />
      ) : (
        <EmptyState
          title="No matching questions"
          description="Try a different search term."
        />
      ),
    };
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
          Frequently asked questions
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          Everything you need to know about using CareerNexus.
        </p>
      </div>
      <div className="mx-auto mt-8 max-w-md">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search questions..."
        />
      </div>
      <div className="mt-10">
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
}
