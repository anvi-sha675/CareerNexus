import PageHeader from "../../components/common/PageHeader";
import SectionEditor from "../../components/profile/SectionEditor";
import Spinner from "../../components/common/Spinner";
import { useSectionSync } from "../../hooks/useSectionSync";
import { certificationsService } from "../../services/studentProfileService";

export default function Certifications() {
  const {
    entries: certifications,
    onChange,
    loading,
  } = useSectionSync(certificationsService);

  return (
    <div>
      <PageHeader
        title="Certifications"
        description="Credentials that strengthen your profile."
        breadcrumbs={[
          { label: "Profile", to: "/student/profile" },
          { label: "Certifications" },
        ]}
      />
      {loading ? (
        <Spinner />
      ) : (
        <SectionEditor
          title="Certifications"
          addLabel="Add certification"
          emptyLabel="No certifications added yet"
          entries={certifications}
          onChange={onChange}
          fields={[
            { name: "name", label: "Certification name", required: true },
            { name: "issuer", label: "Issuing organization", required: true },
            {
              name: "date",
              label: "Date earned",
              placeholder: "e.g. March 2026",
            },
            {
              name: "credentialUrl",
              label: "Credential URL",
              placeholder: "https://",
            },
          ]}
          renderItem={(entry) => (
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-100">
                {entry.name}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {entry.issuer} · {entry.date}
              </p>
              {entry.credentialUrl && (
                <a
                  href={entry.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-xs text-primary-600 hover:underline"
                >
                  View credential
                </a>
              )}
            </div>
          )}
        />
      )}
    </div>
  );
}
