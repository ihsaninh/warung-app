import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
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
import {
  useDistricts,
  useProvinces,
  useRegencies,
  useSubdistricts,
} from '~/lib/hooks/useWilayah';

interface WilayahItem {
  id: string;
  value: string;
}

const phoneRegex = /^(\+62|62|0)8[1-9]\d{6,10}$/;

const storeSchema = z.object({
  name: z.string().min(1, 'Nama toko wajib diisi'),
  phone: z
    .string()
    .regex(phoneRegex, 'Nomor HP harus format Indonesia, contoh: 081234567890'),
  email: z.string().email('Email tidak valid'),
  description: z.string().optional(),
  address: z.string().min(1, 'Alamat wajib diisi'),
  province_id: z.union([
    z.string().min(1, 'Pilih provinsi'),
    z.number().int().positive(),
  ]),
  city_id: z.union([z.string().min(1, 'Pilih kota'), z.number().int().positive()]),
  district_id: z.union([
    z.string().min(1, 'Pilih kecamatan'),
    z.number().int().positive(),
  ]),
  sub_district_id: z.union([
    z.string().min(1, 'Pilih kelurahan'),
    z.number().int().positive(),
  ]),
  photo_url: z.string().optional(),
});

type StoreForm = z.infer<typeof storeSchema>;

export default function RegisterStore() {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StoreForm>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      description: '',
      address: '',
      province_id: '',
      city_id: '',
      district_id: '',
      sub_district_id: '',
      photo_url: '',
    },
  });

  const [loading, setLoading] = useState(false);

  const selectedProvinceId = watch('province_id');
  const selectedCityId = watch('city_id');
  const selectedDistrictId = watch('district_id');
  const photoUrl = watch('photo_url');

  const { data: provinces = [], isLoading: isLoadingProvinces } = useProvinces();

  const { data: cities = [], isLoading: isLoadingCities } = useRegencies(
    selectedProvinceId ? Number(selectedProvinceId) : undefined,
  );

  const { data: districts = [], isLoading: isLoadingDistricts } = useDistricts(
    selectedProvinceId ? Number(selectedProvinceId) : undefined,
    selectedCityId ? Number(selectedCityId) : undefined,
  );
  const { data: subDistricts = [], isLoading: isLoadingSubDistricts } = useSubdistricts(
    selectedProvinceId ? Number(selectedProvinceId) : undefined,
    selectedCityId ? Number(selectedCityId) : undefined,
    selectedDistrictId ? Number(selectedDistrictId) : undefined,
  );

  const findItemById = (items: WilayahItem[], id: string | number) => {
    const found = items.find((item) => item.id === id);
    return found ? { value: found.id, label: found.value } : undefined;
  };

  useEffect(() => {
    setValue('city_id', '');
    setValue('district_id', '');
    setValue('sub_district_id', '');
  }, [selectedProvinceId, setValue]);

  useEffect(() => {
    setValue('district_id', '');
    setValue('sub_district_id', '');
  }, [selectedCityId, setValue]);

  useEffect(() => {
    setValue('sub_district_id', '');
  }, [selectedDistrictId, setValue]);

  const pickImage = async () => {
    if (Platform.OS === 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Maaf, kami memerlukan izin galeri untuk memilih foto.');
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setValue('photo_url', result.assets[0].uri);
    }
  };

  const onSubmit = (data: StoreForm) => {
    console.log(data);
    setLoading(true);
    // Check If user upload the store image or not
    // IF yes Perform the upload file to supabase storage: - bucket name product-image
    // After that getting the image and get the url image from supabase
    // Insert store data to stores table

    // If not Insert store data to stores table
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
                  placeholder="Contoh: 081234567890"
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
              name="province_id"
              render={({ field: { onChange, value } }) => (
                <Select
                  value={findItemById(provinces, value)}
                  onValueChange={(selectedOption) => {
                    onChange(selectedOption ? selectedOption.value : '');
                  }}
                  disabled={isLoadingProvinces}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={isLoadingProvinces ? 'Memuat...' : 'Pilih Provinsi'}
                    />
                  </SelectTrigger>
                  <SelectContent className="w-2/4">
                    <ScrollView className="max-h-56">
                      {provinces.map((item: WilayahItem) => (
                        <SelectItem key={item.id} value={item.id} label={item.value}>
                          {item.value}
                        </SelectItem>
                      ))}
                    </ScrollView>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.province_id && (
              <Text className="text-sm text-red-500">{errors.province_id.message}</Text>
            )}

            <Text>Kota/Kabupaten</Text>
            <Controller
              control={control}
              name="city_id"
              render={({ field: { onChange, value } }) => (
                <Select
                  value={findItemById(cities, value)}
                  onValueChange={(selectedOption) => {
                    onChange(selectedOption ? selectedOption.value : '');
                  }}
                  disabled={!selectedProvinceId || isLoadingCities}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingCities
                          ? 'Memuat...'
                          : !selectedProvinceId
                            ? 'Pilih Provinsi terlebih dahulu'
                            : 'Pilih Kota/Kabupaten'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="w-2/4">
                    <ScrollView className="max-h-56">
                      {cities.map((item: WilayahItem) => (
                        <SelectItem key={item.id} value={item.id} label={item.value}>
                          {item.value}
                        </SelectItem>
                      ))}
                    </ScrollView>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.city_id && (
              <Text className="text-sm text-red-500">{errors.city_id.message}</Text>
            )}

            <Text>Kecamatan</Text>
            <Controller
              control={control}
              name="district_id"
              render={({ field: { onChange, value } }) => (
                <Select
                  value={findItemById(districts, value)}
                  onValueChange={(selectedOption) => {
                    onChange(selectedOption ? selectedOption.value : '');
                  }}
                  disabled={!selectedCityId || isLoadingDistricts}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingDistricts
                          ? 'Memuat...'
                          : !selectedCityId
                            ? 'Pilih Kota/Kabupaten terlebih dahulu'
                            : 'Pilih Kecamatan'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="w-2/4">
                    <ScrollView className="max-h-56">
                      {districts.map((item: WilayahItem) => (
                        <SelectItem key={item.id} value={item.id} label={item.value}>
                          {item.value}
                        </SelectItem>
                      ))}
                    </ScrollView>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.district_id && (
              <Text className="text-sm text-red-500">{errors.district_id.message}</Text>
            )}

            <Text>Kelurahan</Text>
            <Controller
              control={control}
              name="sub_district_id"
              render={({ field: { onChange, value } }) => (
                <Select
                  value={findItemById(subDistricts, value)}
                  onValueChange={(selectedOption) => {
                    onChange(selectedOption ? selectedOption.value : '');
                  }}
                  disabled={!selectedDistrictId || isLoadingSubDistricts}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingSubDistricts
                          ? 'Memuat...'
                          : !selectedDistrictId
                            ? 'Pilih Kecamatan terlebih dahulu'
                            : 'Pilih Kelurahan'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="w-2/4">
                    <ScrollView className="max-h-56">
                      {subDistricts.map((item: WilayahItem) => (
                        <SelectItem key={item.id} value={item.id} label={item.value}>
                          {item.value}
                        </SelectItem>
                      ))}
                    </ScrollView>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.sub_district_id && (
              <Text className="text-sm text-red-500">
                {errors.sub_district_id.message}
              </Text>
            )}

            <Text>Foto Toko</Text>
            <TouchableOpacity
              className="h-24 w-24 items-center justify-center rounded-md border"
              onPress={pickImage}
            >
              {photoUrl ? (
                <Image source={{ uri: photoUrl }} className="h-24 w-24 rounded-md" />
              ) : (
                <Text>Pilih Foto</Text>
              )}
            </TouchableOpacity>
            {errors.photo_url && (
              <Text className="text-sm text-red-500">{errors.photo_url.message}</Text>
            )}
          </View>
          <Button className="mt-8" onPress={handleSubmit(onSubmit)} disabled={loading}>
            <Text className="font-bold">{loading ? 'Menyimpan...' : 'Simpan Toko'}</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
