'use client';

import { useStats } from '@/contexts/StatsContext';
import siteConfig from '@/site.config.mjs';

interface HomeScreenProps {
  onStartDetection: () => void;
}

export default function HomeScreen({ onStartDetection }: HomeScreenProps) {
  const { stats, isLoading } = useStats();

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-[var(--spacing-md)]">
        <div className="text-[var(--color-text-secondary)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-[var(--spacing-md)] pt-[calc(var(--safe-area-top)+var(--spacing-md))] pb-[calc(var(--safe-area-bottom)+80px)] space-y-[var(--spacing-lg)]">
      {/* Header */}
      <div className="pt-[var(--spacing-xs)]">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          {siteConfig.site.name}
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Your Personal Phone Detector
        </p>
      </div>

      {/* Hero Illustration */}
      <div className="flex justify-start">
        <div className="relative w-40 h-40">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-purple-600 opacity-20 animate-pulse"></div>
          {/* Middle ring */}
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-purple-600 opacity-40"></div>
          {/* Inner circle */}
          <div className="absolute inset-6 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center shadow-2xl">
            <span className="text-7xl">📱</span>
          </div>
        </div>
      </div>

      {/* Start Detection Button - Hero CTA */}
      <button
        onClick={() => {
          console.log('[HomeScreen] START DETECTION button clicked');
          onStartDetection();
        }}
        className="w-full bg-[var(--color-primary)] active:bg-[#8B1F75] text-white font-semibold py-[13px] px-6 rounded-[var(--radius-md)] transition-colors duration-150 text-[17px] leading-[22px] tracking-[-0.011em]"
      >
        START DETECTION
      </button>

      {/* Stats Dashboard */}
      <div>
        <h2 className="text-[13px] font-normal text-[var(--ios-tertiary-label)] uppercase tracking-[-0.003em] mb-2 px-[var(--spacing-sm)]">
          PERFORMANCE
        </h2>
        <div className="bg-[var(--ios-card-bg)] rounded-[var(--radius-md)] divide-y divide-[var(--ios-separator)] overflow-hidden">
          {/* Sessions stat */}
          <div className="px-[var(--spacing-sm)] py-[11px] flex items-center justify-between">
            <span className="text-[17px] text-[var(--ios-label-color)] font-normal">
              Sessions
            </span>
            <span className="text-[17px] text-[var(--ios-secondary-label)] font-normal tabular-nums">
              {stats.totalSessions}
            </span>
          </div>

          {/* Phones caught stat */}
          <div className="px-[var(--spacing-sm)] py-[11px] flex items-center justify-between">
            <span className="text-[17px] text-[var(--ios-label-color)] font-normal">
              Phones Caught
            </span>
            <span className="text-[17px] text-[var(--ios-secondary-label)] font-normal tabular-nums">
              {stats.totalPhonesDetected}
            </span>
          </div>

          {/* Total time stat */}
          <div className="px-[var(--spacing-sm)] py-[11px] flex items-center justify-between">
            <span className="text-[17px] text-[var(--ios-label-color)] font-normal">
              Total Time
            </span>
            <span className="text-[17px] text-[var(--ios-secondary-label)] font-normal tabular-nums">
              {formatTime(stats.totalTimeSeconds)}
            </span>
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-[var(--ios-card-bg)] rounded-[var(--radius-md)] p-[var(--spacing-md)]">
        <p className="text-[15px] text-[var(--ios-secondary-label)] mb-3 leading-[20px]">
          Ask your gym to install Phone Lunk
        </p>
        <a
          href="https://phone-lunk.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[var(--color-primary)] font-normal text-[17px]"
        >
          phone-lunk.app
          <span className="text-sm">→</span>
        </a>
      </div>
    </div>
  );
}
