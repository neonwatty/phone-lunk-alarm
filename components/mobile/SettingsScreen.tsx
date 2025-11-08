'use client';

import { useSettings } from '@/contexts/SettingsContext';
import { useStats } from '@/contexts/StatsContext';
import { useState } from 'react';

export default function SettingsScreen() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { clearStats } = useStats();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleToggle = async (key: keyof typeof settings) => {
    await updateSettings({ [key]: !settings[key] });
  };

  const handleClearData = async () => {
    await clearStats();
    setShowClearConfirm(false);
  };

  return (
    <div className="px-[var(--spacing-md)] pt-[calc(var(--safe-area-top)+var(--spacing-md))] pb-[calc(var(--safe-area-bottom)+80px)] space-y-[var(--spacing-lg)]">
      {/* Header */}
      <div className="pt-[var(--spacing-xs)]">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Settings
        </h1>
      </div>

      {/* Detection Sensitivity - Featured Section */}
      <div>
        <h2 className="text-[13px] font-normal text-[var(--ios-tertiary-label)] uppercase tracking-[-0.003em] mb-2 px-[var(--spacing-sm)]">
          DETECTION SENSITIVITY
        </h2>
        <div className="bg-[var(--ios-card-bg)] rounded-[var(--radius-md)] px-[var(--spacing-sm)] py-[var(--spacing-md)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[17px] text-[var(--ios-label-color)] font-normal">
              Sensitivity
            </span>
            <span className="text-[17px] text-[var(--ios-secondary-label)] font-normal tabular-nums">
              {Math.round(settings.detectionSensitivity)}%
            </span>
          </div>

          <input
            type="range"
            min="10"
            max="90"
            value={settings.detectionSensitivity}
            onChange={(e) => updateSettings({ detectionSensitivity: Number(e.target.value) })}
            className="w-full h-[2px] cursor-pointer appearance-none bg-[var(--ios-system-gray4)]
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-[28px]
              [&::-webkit-slider-thumb]:h-[28px]
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
          />

          <div className="flex justify-between text-[13px] text-[var(--ios-tertiary-label)] mt-2">
            <span>Less Sensitive</span>
            <span>More Sensitive</span>
          </div>
        </div>
      </div>

      {/* Detection Settings */}
      <div>
        <h2 className="text-[13px] font-normal text-[var(--ios-tertiary-label)] uppercase tracking-[-0.003em] mb-2 px-[var(--spacing-sm)]">
          DETECTION SETTINGS
        </h2>
        <div className="bg-[var(--color-bg-secondary)] rounded-[var(--radius-sm)] divide-y divide-[var(--color-border)]">
          <div className="flex items-center justify-between px-[var(--spacing-sm)] py-[var(--spacing-xs)] min-h-[var(--tap-target-min)]">
            <div className="flex items-center gap-3">
              <span className="text-[17px] text-[var(--ios-label-color)] font-normal">Alarm Sound</span>
            </div>
            <button
              onClick={() => handleToggle('alarmSound')}
              className={`
                relative inline-flex h-[31px] w-[51px] items-center rounded-full
                transition-colors duration-200
                ${settings.alarmSound ? 'bg-[var(--ios-system-green)]' : 'bg-[var(--ios-system-gray)]'}
              `}
            >
              <span
                className={`
                  inline-block h-[27px] w-[27px] transform rounded-full bg-white
                  shadow-[0_3px_8px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.16)]
                  transition-transform duration-200
                  ${settings.alarmSound ? 'translate-x-[22px]' : 'translate-x-[2px]'}
                `}
              />
            </button>
          </div>

          <div className="flex items-center justify-between px-[var(--spacing-sm)] py-[var(--spacing-xs)] min-h-[var(--tap-target-min)]">
            <div className="flex items-center gap-3">
              <span className="text-[17px] text-[var(--ios-label-color)] font-normal">Auto-capture</span>
            </div>
            <button
              onClick={() => handleToggle('autoCapture')}
              className={`
                relative inline-flex h-[31px] w-[51px] items-center rounded-full
                transition-colors duration-200
                ${settings.autoCapture ? 'bg-[var(--ios-system-green)]' : 'bg-[var(--ios-system-gray)]'}
              `}
            >
              <span
                className={`
                  inline-block h-[27px] w-[27px] transform rounded-full bg-white
                  shadow-[0_3px_8px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.16)]
                  transition-transform duration-200
                  ${settings.autoCapture ? 'translate-x-[22px]' : 'translate-x-[2px]'}
                `}
              />
            </button>
          </div>
        </div>
      </div>

      {/* App Preferences */}
      <div>
        <h2 className="text-[13px] font-normal text-[var(--ios-tertiary-label)] uppercase tracking-[-0.003em] mb-2 px-[var(--spacing-sm)]">
          APP PREFERENCES
        </h2>
        <div className="bg-[var(--color-bg-secondary)] rounded-[var(--radius-sm)] divide-y divide-[var(--color-border)]">
          <div className="flex items-center justify-between px-[var(--spacing-sm)] py-[var(--spacing-xs)] min-h-[var(--tap-target-min)]">
            <div className="flex items-center gap-3">
              <span className="text-[17px] text-[var(--ios-label-color)] font-normal">Dark Mode</span>
            </div>
            <button
              onClick={() => handleToggle('darkMode')}
              className={`
                relative inline-flex h-[31px] w-[51px] items-center rounded-full
                transition-colors duration-200
                ${settings.darkMode ? 'bg-[var(--ios-system-green)]' : 'bg-[var(--ios-system-gray)]'}
              `}
            >
              <span
                className={`
                  inline-block h-[27px] w-[27px] transform rounded-full bg-white
                  shadow-[0_3px_8px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.16)]
                  transition-transform duration-200
                  ${settings.darkMode ? 'translate-x-[22px]' : 'translate-x-[2px]'}
                `}
              />
            </button>
          </div>
        </div>
      </div>

      {/* About */}
      <div>
        <h2 className="text-[13px] font-normal text-[var(--ios-tertiary-label)] uppercase tracking-[-0.003em] mb-2 px-[var(--spacing-sm)]">
          ABOUT
        </h2>
        <div className="bg-[var(--color-bg-secondary)] rounded-[var(--radius-sm)] divide-y divide-[var(--color-border)]">
          <a
            href="https://phone-lunk.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-[var(--spacing-sm)] py-[var(--spacing-xs)] min-h-[var(--tap-target-min)] active:bg-[var(--color-bg-tertiary)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌐</span>
              <span className="text-[var(--color-text-primary)]">Visit phone-lunk.app</span>
            </div>
            <span className="text-[var(--color-text-secondary)]">→</span>
          </a>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center justify-between px-[var(--spacing-sm)] py-[var(--spacing-xs)] min-h-[var(--tap-target-min)] w-full active:bg-[var(--color-bg-tertiary)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🗑️</span>
              <span className="text-red-600">Clear All Data</span>
            </div>
          </button>
        </div>
      </div>

      {/* Clear Data Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-[var(--spacing-lg)]">
          <div className="bg-[var(--color-bg-primary)] rounded-[var(--radius-lg)] p-[var(--spacing-lg)] w-full mx-[var(--spacing-lg)]">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
              Clear All Data?
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-6">
              This will permanently delete all your stats and settings. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 bg-[var(--color-bg-secondary)] active:bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] font-medium py-2 px-4 rounded-[var(--radius-sm)] transition-colors min-h-[var(--tap-target-min)]"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 bg-red-600 active:bg-red-700 text-white font-medium py-2 px-4 rounded-[var(--radius-sm)] transition-colors min-h-[var(--tap-target-min)]"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
