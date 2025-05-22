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
        emailRedirectTo: 'warungapp://login'
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
    <View className="flex-1 justify-center px-6 gap-4">
      <Text className="text-2xl font-bold mb-4">Daftar Akun</Text>
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
      {message && <Text className="text-green-600 text-center mb-2">{message}</Text>}
      {error && <Text className="text-red-500 text-center mb-2">{error}</Text>}
      <Button onPress={handleSubmit(onSubmit)} disabled={loading}>
        <Text>{loading ? 'Mendaftar...' : 'Daftar'}</Text>
      </Button>
      <View className="flex-row justify-center mt-4">
        <Text>Sudah punya akun? </Text>
        <Text className="text-blue-500" onPress={() => router.push(ROUTES.login)}>Login</Text>
      </View>
    </View>
  );
}