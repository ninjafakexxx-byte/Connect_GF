import { Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { externalSupabase as supabase } from '@/integrations/external-supabase/client';

const ONLINE_WINDOW_MS = 1000 * 60 * 2;

interface OnlineUser {
  user_id: string;
  name: string;
  last_seen: string;
}

export function OnlineUsersIndicator() {
  const [users, setUsers] = useState<OnlineUser[]>([]);

  const loadUsers = async () => {
    const cutoff = new Date(Date.now() - ONLINE_WINDOW_MS).toISOString();

    const { data, error } = await (supabase as any)
      .from('online_users')
      .select('user_id,name,last_seen')
      .gte('last_seen', cutoff)
      .order('last_seen', { ascending: false });

    if (!error && data) {
      setUsers(data);
    }
  };

  useEffect(() => {
    loadUsers();

    const interval = window.setInterval(loadUsers, 30000);

    const channel = supabase
      .channel('online-users-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'online_users' },
        () => loadUsers(),
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  const activeUsers = useMemo(() => {
    const unique = new Map<string, OnlineUser>();

    users.forEach((user) => {
      unique.set(user.user_id, user);
    });

    return Array.from(unique.values());
  }, [users]);

  return (
    <div className="hidden md:flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300 backdrop-blur-sm">
      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      <Users className="h-3.5 w-3.5" />
      <span className="font-medium">
        {activeUsers.length} online
      </span>
    </div>
  );
}
