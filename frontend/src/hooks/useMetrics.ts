import { useEffect, useState } from 'react';
import type { MetricsSummary } from '../types';
import { getMetrics } from '../services/metricsService';

export function useMetrics(active: boolean) {
    const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
    const [loadingMetrics, setLoadingMetrics] = useState(false);
    const [metricsError, setMetricsError] = useState<string | null>(null);

    useEffect(() => {
        if (!active) return;

        let cancelled = false;

        async function load() {
            try {
                setLoadingMetrics(true);
                const data = await getMetrics();
                if (!cancelled) setMetrics(data);
            } catch {
                if (!cancelled) setMetricsError('Failed to load metrics.');
            } finally {
                if (!cancelled) setLoadingMetrics(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [active]);

    return { metrics, loadingMetrics, metricsError };
}
