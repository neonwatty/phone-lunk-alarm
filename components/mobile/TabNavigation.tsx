'use client';

import { HomeIcon, CameraIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  CameraIcon as CameraIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from '@heroicons/react/24/solid';
import type { TabView } from '@/app/mobile/page';

interface Tab {
  name: string;
  view: TabView;
  icon: React.ComponentType<{ className?: string }>;
  activeIcon: React.ComponentType<{ className?: string }>;
}

const tabs: Tab[] = [
  {
    name: 'Home',
    view: 'home',
    icon: HomeIcon,
    activeIcon: HomeIconSolid,
  },
  {
    name: 'Detect',
    view: 'detect',
    icon: CameraIcon,
    activeIcon: CameraIconSolid,
  },
  {
    name: 'Settings',
    view: 'settings',
    icon: Cog6ToothIcon,
    activeIcon: Cog6ToothIconSolid,
  },
];

interface TabNavigationProps {
  activeTab: TabView;
  onTabChange: (tab: TabView) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  console.log('[TabNavigation] Active tab:', activeTab);

  const handleTabClick = (tab: Tab) => {
    console.log('[TabNavigation] Tab clicked:', tab.name);
    onTabChange(tab.view);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)] pb-[var(--safe-area-bottom)]">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.view;
          const Icon = isActive ? tab.activeIcon : tab.icon;

          return (
            <button
              key={tab.name}
              onClick={() => handleTabClick(tab)}
              className={`
                flex flex-col items-center justify-center flex-1 h-full
                transition-colors duration-200 touch-manipulation cursor-pointer
                ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}
                active:opacity-70 min-h-[var(--tap-target-min)]
              `}
              aria-label={`Navigate to ${tab.name}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{tab.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
