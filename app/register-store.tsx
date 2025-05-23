import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Text } from '~/components/ui/text';
import { Textarea } from '~/components/ui/textarea';

const provinces = [
  { value: 'jabar', label: 'Jawa Barat' },
  { value: 'jateng', label: 'Jawa Tengah' },
];
const cities = [
  { label: 'Bandung', value: 'bandung' },
  { label: 'Cimahi', value: 'cimahi' },
];
const districts = [
  { label: 'Coblong', value: 'coblong' },
  { label: 'Sukajadi', value: 'sukajadi' },
];
const subDistricts = [
  { label: 'Dago', value: 'dago' },
  { label: 'Cipaganti', value: 'cipaganti' },
];

const phoneRegex = /^\+62\d{9,13}$/;

const storeSchema = z.object({
  name: z.string().min(1, 'Nama toko wajib diisi'),
  phone: z
    .string()
    .regex(phoneRegex, 'Nomor HP harus format Indonesia, contoh: +6281234567890'),
  email: z.string().email('Email tidak valid'),
  description: z.string().optional(),
  address: z.string().min(1, 'Alamat wajib diisi'),
  province: z.object({ value: z.string().min(1, 'Pilih provinsi'), label: z.string() }),
  city: z.object({ value: z.string().min(1, 'Pilih kota'), label: z.string() }),
  district: z.object({ value: z.string().min(1, 'Pilih kecamatan'), label: z.string() }),
  sub_district: z.object({
    value: z.string().min(1, 'Pilih kelurahan'),
    label: z.string(),
  }),
  photo_url: z.string().optional(),
});

type StoreForm = z.infer<typeof storeSchema>;

export default function RegisterStore() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StoreForm>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      description: '',
      address: '',
      province: { value: '', label: '' },
      city: { value: '', label: '' },
      district: { value: '', label: '' },
      sub_district: { value: '', label: '' },
      photo_url: '',
    },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = (data: StoreForm) => {
    console.log(data);
    setLoading(true);
    // TODO: handle store registration
    setLoading(false);
  };

  return (
    <View className="flex-1">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-md p-4">
          <Text className="mb-4 text-center text-2xl font-bold">Registrasi Toko</Text>
          <View className="gap-3">
            <Text>Nama Toko</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Nama Toko"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.name && (
              <Text className="text-sm text-red-500">{errors.name.message}</Text>
            )}

            <Text>No. HP</Text>
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Contoh: +6281234567890"
                  keyboardType="phone-pad"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.phone && (
              <Text className="text-sm text-red-500">{errors.phone.message}</Text>
            )}

            <Text>Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Email"
                  keyboardType="email-address"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.email && (
              <Text className="text-sm text-red-500">{errors.email.message}</Text>
            )}

            <Text>Deskripsi</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <Textarea
                  placeholder="Deskripsi Toko"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.description && (
              <Text className="text-sm text-red-500">{errors.description.message}</Text>
            )}

            <Text>Alamat</Text>
            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, onBlur, value } }) => (
                <Textarea
                  placeholder="Alamat lengkap"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.address && (
              <Text className="text-sm text-red-500">{errors.address.message}</Text>
            )}

            <Text>Provinsi</Text>
            <Controller
              control={control}
              name="province"
              render={({ field: { onChange, value } }) => (
                <Select value={value.value ? value : undefined} onValueChange={onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Provinsi" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((item) => (
                      <SelectItem key={item.value} value={item.value} label={item.label}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.province && (
              <Text className="text-sm text-red-500">{errors.province.message}</Text>
            )}

            <Text>Kota/Kabupaten</Text>
            <Controller
              control={control}
              name="city"
              render={({ field: { onChange, value } }) => (
                <Select value={value.value ? value : undefined} onValueChange={onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kota/Kabupaten" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((item) => (
                      <SelectItem key={item.value} value={item.value} label={item.label}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.city && (
              <Text className="text-sm text-red-500">{errors.city.message}</Text>
            )}

            <Text>Kecamatan</Text>
            <Controller
              control={control}
              name="district"
              render={({ field: { onChange, value } }) => (
                <Select value={value.value ? value : undefined} onValueChange={onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kecamatan" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((item) => (
                      <SelectItem key={item.value} value={item.value} label={item.label}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.district && (
              <Text className="text-sm text-red-500">{errors.district.message}</Text>
            )}

            <Text>Kelurahan</Text>
            <Controller
              control={control}
              name="sub_district"
              render={({ field: { onChange, value } }) => (
                <Select value={value.value ? value : undefined} onValueChange={onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kelurahan" />
                  </SelectTrigger>
                  <SelectContent>
                    {subDistricts.map((item) => (
                      <SelectItem key={item.value} value={item.value} label={item.label}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.sub_district && (
              <Text className="text-sm text-red-500">{errors.sub_district.message}</Text>
            )}

            <Text>Foto Toko</Text>
            <Controller
              control={control}
              name="photo_url"
              render={({ field: { value } }) => (
                <TouchableOpacity
                  className="h-24 w-24 items-center justify-center rounded-md border"
                  onPress={() => {
                    // TODO: handle photo upload
                  }}
                >
                  {value ? (
                    <Image source={{ uri: value }} className="h-24 w-24 rounded-md" />
                  ) : (
                    <Text>Pilih Foto</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
          <Button className="mt-8" onPress={handleSubmit(onSubmit)} disabled={loading}>
            <Text className="font-bold">{loading ? 'Menyimpan...' : 'Simpan Toko'}</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
