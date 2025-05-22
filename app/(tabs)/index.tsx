import { Button } from "~/components/ui/button";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { ROUTES } from "~/lib/constants/routes";

export default function Dashboard() {
  const router = useRouter();
  return (
    <View className="flex-1 justify-center items-center gap-4">
      <Button onPress={() => router.push(ROUTES.login)}>
        <Text>Go to Login</Text>
      </Button>
      <Button onPress={() => router.push(ROUTES.signup)}>
        <Text>Go to Signup</Text>
      </Button>
    </View>
  );
}