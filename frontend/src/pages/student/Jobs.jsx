import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, SearchX } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import SearchInput from "../../components/common/SearchInput";
import SelectField from "../../components/forms/SelectField";
import JobCard from "../../components/jobs/JobCard";
import FilterPanel from "../../components/jobs/FilterPanel";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";
import { CardSkeleton } from "../../components/common/Skeleton";
import Button from "../../components/common/Button";
import Drawer from "../../components/common/Drawer";
import { useAsync } from "../../hooks/useAsync";
import { useDebounce } from "../../hooks/useDebounce";
import { usePagination } from "../../hooks/usePagination";
import { useAuth } from "../../context/AuthContext";
import * as jobsService from "../../services/jobsService";
import * as studentProfileService from "../../services/studentProfileService";

const SORT_OPTIONS = [
  { value: "match", label: "Best match" },
  { value: "recent", label: "Most recent" },
  { value: "salary", label: "Highest salary" },
];

export default function Jobs() {
  const { user } = useAuth();
  const isStudent = user?.role === "student";
  const { data: jobs, loading } = useAsync(jobsService.getJobs, []);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [filters, setFilters] = useState({
    type: [],
    experience: [],
    remote: false,
  });
  const [sort, setSort] = useState("match");
  const [savedIds, setSavedIds] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (!isStudent) return;
    studentProfileService
      .listSavedJobs()
      .then((jobs) => setSavedIds(jobs.map((j) => j.id)));
  }, [isStudent]);

  const filtered = useMemo(() => {
    let result = (jobs || []).filter((job) => job.status === "Active");
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (filters.type?.length)
      result = result.filter((j) => filters.type.includes(j.type));
    if (filters.experience?.length)
      result = result.filter((j) => filters.experience.includes(j.experience));
    if (filters.remote) result = result.filter((j) => j.remote);

    result = [...result].sort((a, b) => {
      if (sort === "match") return b.matchScore - a.matchScore;
      if (sort === "recent") return new Date(b.postedAt) - new Date(a.postedAt);
      if (sort === "salary") return b.salaryMax - a.salaryMax;
      return 0;
    });
    return result;
  }, [jobs, debouncedQuery, filters, sort]);

  const { page, setPage, totalPages, pageItems } = usePagination(filtered, 6);

  const toggleSave = (id) => {
    const isSaved = savedIds.includes(id);
    setSavedIds((prev) =>
      isSaved ? prev.filter((i) => i !== id) : [...prev, id],
    );
    if (!isStudent) return;
    if (isSaved) studentProfileService.unsaveJob(id);
    else studentProfileService.saveJob(id);
  };
  const resetFilters = () =>
    setFilters({ type: [], experience: [], remote: false });

  return (
    <div>
      <PageHeader
        title="Browse Jobs"
        description={`${filtered.length} open roles matched to your profile`}
        breadcrumbs={[{ label: "Jobs" }]}
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search by title, company, or skill..."
          className="flex-1"
        />
        <SelectField
          options={SORT_OPTIONS}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full sm:w-52"
        />
        <Button
          variant="secondary"
          icon={SlidersHorizontal}
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden"
        >
          Filters
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="hidden lg:col-span-1 lg:block">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onReset={resetFilters}
          />
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : pageItems.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No jobs match your filters"
              description="Try adjusting your search or filters."
              actionLabel="Reset filters"
              onAction={resetFilters}
            />
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                {pageItems.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    saved={savedIds.includes(job.id)}
                    onSave={toggleSave}
                  />
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>

      <Drawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        title="Filters"
        side="left"
      >
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
        />
      </Drawer>
    </div>
  );
}
