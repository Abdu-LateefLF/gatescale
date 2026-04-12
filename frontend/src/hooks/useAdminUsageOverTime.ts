import { useEffect, useState } from 'react';
import type { TimeRange, UsageDataPoint } from '../types';
import { getAdminUsageOverTime } from '../services/adminService';

export function useAdminUsageOverTime(active: boolean) {
    const [range, setRange] = useState<TimeRange>('7d');
    const [data, setData] = useState<UsageDataPoint[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!active) return;

        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                setError(null);
                const result = await getAdminUsageOverTime(range);
                if (!cancelled) setData(result);
            } catch {
                if (!cancelled) setError('Failed to load chart data.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [active, range]);

    return { range, setRange, data, loading, error };
}
