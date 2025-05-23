import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ROUTES } from '~/lib/constants/routes';
import { useAuth } from '~/lib/contexts/AuthContext';
import { supabase } from '~/lib/utils/supabase';

function isAuthPage(pathname: string) {
  return pathname === ROUTES.login || pathname === ROUTES.signup;
}

function isRegisterStorePage(pathname: string) {
  return pathname === ROUTES.registerStore;
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function handleAuthGuard() {
      if (loading) return;

      if (!user && !isAuthPage(pathname)) {
        router.replace(ROUTES.login);
        setChecking(false);
        return;
      }

      if (user) {
        const { data: userProfile } = await supabase
          .from('users')
          .select('store_id')
          .eq('id', user.id)
          .single();

        if (!userProfile?.store_id && !isRegisterStorePage(pathname)) {
          router.replace(ROUTES.registerStore);
          setChecking(false);
          return;
        }

        if (
          userProfile?.store_id &&
          (isAuthPage(pathname) || isRegisterStorePage(pathname))
        ) {
          router.replace(ROUTES.dashboard);
          setChecking(false);
          return;
        }
      }

      setChecking(false);
    }
    handleAuthGuard();
  }, [user, loading, pathname]);

  if (checking) return null;

  return <>{children}</>;
}
