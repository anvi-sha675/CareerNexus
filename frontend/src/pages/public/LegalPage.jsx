export default function LegalPage({ title, updatedAt, sections }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
        {title}
      </h1>
      <p className="mt-2 text-sm text-slate-400">Last updated {updatedAt}</p>
      <div className="prose-slate mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {section.heading}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
