import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { ROUTES } from '~/lib/constants/routes';
import { supabase } from '~/lib/utils/supabase';

const signupSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '' },
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: SignupForm) => {
    setLoading(true);
    setMessage(null);
    setError(null);
    const { email, password } = data;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'warungapp://login',
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMessage('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.');
    }
  };

  return (
    <View className="flex-1 justify-center gap-4 px-6">
      <Text className="mb-4 text-2xl font-bold">Daftar Akun</Text>
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
          <Text className="mt-1 text-sm text-red-500">{errors.email.message}</Text>
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
          <Text className="mt-1 text-sm text-red-500">{errors.password.message}</Text>
        )}
      </View>
      {message && <Text className="mb-2 text-center text-green-600">{message}</Text>}
      {error && <Text className="mb-2 text-center text-red-500">{error}</Text>}
      <Button onPress={handleSubmit(onSubmit)} disabled={loading}>
        <Text>{loading ? 'Mendaftar...' : 'Daftar'}</Text>
      </Button>
      <View className="mt-4 flex-row justify-center">
        <Text>Sudah punya akun? </Text>
        <Text className="text-blue-500" onPress={() => router.push(ROUTES.login)}>
          Login
        </Text>
      </View>
    </View>
  );
}
