import { View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useAuth } from '~/lib/AuthContext';
import { supabase } from '~/lib/utils/supabase';

export default function RegisterStore() {
  const { refresh } = useAuth();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    refresh();
  };
  return (
    <View className="flex-1 justify-center items-center gap-4">
      <Text className="text-2xl font-bold mb-4">Settings</Text>
      <Button onPress={handleLogout} className="bg-red-500">
        <Text className="text-white font-bold">Logout</Text>
      </Button>
    </View>
  );
}