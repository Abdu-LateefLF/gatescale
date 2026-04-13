export function calculateResetTimeByDayEnd(ttl: number): number {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeInADay = 24 * 60 * 60;
    const timeTillNextDay = timeInADay - (currentTime % timeInADay);

    const resetTime = currentTime + Math.min(ttl, timeTillNextDay);
    return resetTime;
}
