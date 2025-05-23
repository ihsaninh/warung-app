import { Text, View } from 'react-native';
import { Button } from '~/components/ui/button';
import { useAuth } from '~/lib/contexts/AuthContext';
import { supabase } from '~/lib/utils/supabase';

export default function Settings() {
  const { refresh } = useAuth();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    refresh();
  };
  return (
    <View className="flex-1 items-center justify-center gap-4">
      <Text className="mb-4 text-2xl font-bold">Settings</Text>
      <Button onPress={handleLogout} className="bg-red-500">
        <Text className="font-bold text-white">Logout</Text>
      </Button>
    </View>
  );
}
