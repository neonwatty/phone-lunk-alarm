import { SessionProvider } from '@/contexts/SessionContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { StatsProvider } from '@/contexts/StatsContext';
import { ThemeProvider } from '@/components/ThemeProvider';

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <StatsProvider>
          <SessionProvider>
            {children}
          </SessionProvider>
        </StatsProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
