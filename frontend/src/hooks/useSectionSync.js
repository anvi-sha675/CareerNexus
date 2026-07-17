import { useState, useEffect, useCallback, useRef } from "react";

export function useSectionSync(service) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const entriesRef = useRef(entries);
  entriesRef.current = entries;

  useEffect(() => {
    let mounted = true;
    service
      .list()
      .then((data) => {
        if (mounted) setEntries(data || []);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const onChange = useCallback(
    (newEntries) => {
      const old = entriesRef.current;
      setEntries(newEntries);

      if (newEntries.length > old.length) {
        const added = newEntries.find((e) => !old.some((o) => o.id === e.id));
        if (!added) return;
        const { id, ...payload } = added;
        service.create(payload).then((created) => {
          if (created?.id && created.id !== id) {
            setEntries((curr) => curr.map((e) => (e.id === id ? created : e)));
          }
        });
      } else if (newEntries.length < old.length) {
        const removed = old.find((o) => !newEntries.some((e) => e.id === o.id));
        if (removed) service.remove(removed.id);
      } else {
        const changedIndex = newEntries.findIndex(
          (e, i) => JSON.stringify(e) !== JSON.stringify(old[i]),
        );
        if (changedIndex === -1) return;
        const { id, ...payload } = newEntries[changedIndex];
        service.update(id, payload);
      }
    },
    [service],
  );

  return { entries, setEntries, onChange, loading };
}
