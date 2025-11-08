'use client';

import { useState } from 'react';
import HomeScreen from '@/components/mobile/HomeScreen';
import DetectScreen from '@/components/mobile/DetectScreen';
import SettingsScreen from '@/components/mobile/SettingsScreen';
import TabNavigation from '@/components/mobile/TabNavigation';

export type TabView = 'home' | 'detect' | 'settings';

export default function MobileApp() {
  const [activeTab, setActiveTab] = useState<TabView>('home');

  console.log('[MobileApp] Active tab:', activeTab);

  const handleStartDetection = () => {
    console.log('[MobileApp] Switching to detect screen');
    setActiveTab('detect');
  };

  const handleTabChange = (tab: TabView) => {
    console.log('[MobileApp] Tab changed to:', tab);
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Screen Content */}
      <main className="max-w-md mx-auto pb-16">
        {activeTab === 'home' && <HomeScreen onStartDetection={handleStartDetection} />}
        {activeTab === 'detect' && <DetectScreen />}
        {activeTab === 'settings' && <SettingsScreen />}
      </main>

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
