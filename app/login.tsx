import { View } from 'react-native';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '~/lib/utils/supabase';
import { ROUTES } from '~/lib/constants/routes';

const loginSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError(null);
    const { email, password } = data;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single();

        if (!existingUser) {
          await supabase.from('users').insert({
            id: user.id,
            email: user.email,
          });
        }
      }
    }
  };

  return (
    <View className="flex-1 justify-center px-6 gap-4">
      <Text className="text-2xl font-bold mb-4">Masuk Akun</Text>
      <View className="mb-2">
        <Text className="mb-1">Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Masukkan Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-500 mt-1 text-sm">{errors.email.message}</Text>
        )}
      </View>
      <View className="mb-2">
        <Text className="mb-1">Password</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Masukkan Password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {errors.password && (
          <Text className="text-red-500 mt-1 text-sm">{errors.password.message}</Text>
        )}
      </View>
      {error && <Text className="text-red-500 text-center mb-2">{error}</Text>}
      <Text className="text-right text-blue-500 mb-4">Lupa password?</Text>
      <Button onPress={handleSubmit(onSubmit)} disabled={loading}>
        <Text>{loading ? 'Masuk...' : 'Login'}</Text>
      </Button>
      <View className="flex-row justify-center mt-4">
        <Text>Belum punya akun? </Text>
        <Text className="text-blue-500" onPress={() => router.push(ROUTES.signup)}>Daftar</Text>
      </View>
    </View>
  );
}