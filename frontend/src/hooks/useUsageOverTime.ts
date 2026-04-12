import { useEffect, useState } from 'react';
import type { TimeRange, UsageDataPoint } from '../types';
import { getUsageOverTime } from '../services/metricsService';

export function useUsageOverTime(active: boolean) {
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
                const result = await getUsageOverTime(range);
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
