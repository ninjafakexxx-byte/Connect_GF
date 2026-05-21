import { useEffect } from 'react';
import { externalSupabase as supabase } from '@/integrations/external-supabase/client';
import { useAuth } from '@/hooks/use-auth';

const HEARTBEAT_INTERVAL = 30000;

export function OnlinePresence() {
  const { user, profile } = useAuth();

  useEffect(() => {
    if (!user) return;

    let mounted = true;

    const sendHeartbeat = async () => {
      if (!mounted) return;

      try {
        await supabase.from('online_users').upsert({
          user_id: user.id,
          name:
            profile?.nome ||
            user.user_metadata?.name ||
            user.email ||
            'Usuário',
          last_seen: new Date().toISOString(),
        });
      } catch (error) {
        console.warn('[online-presence]', error);
      }
    };

    sendHeartbeat();

    const interval = window.setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        sendHeartbeat();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      mounted = false;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [user, profile]);

  return null;
}
