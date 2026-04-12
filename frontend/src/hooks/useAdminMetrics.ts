import { useEffect, useState } from 'react';
import type { AdminMetricsSummary } from '../types';
import { getAdminMetrics } from '../services/adminService';

export function useAdminMetrics(active: boolean) {
    const [metrics, setMetrics] = useState<AdminMetricsSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!active) return;

        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                setError(null);
                const data = await getAdminMetrics();
                if (!cancelled) setMetrics(data);
            } catch {
                if (!cancelled) setError('Failed to load admin metrics.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [active]);

    return { metrics, loading, error };
}
