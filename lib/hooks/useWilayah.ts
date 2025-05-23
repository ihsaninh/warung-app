import { useQuery } from '@tanstack/react-query';

const BASE_URL = 'https://ihsaninh.github.io/wilayah-indonesia';

export function useProvinces() {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/provinces.json`);
      return res.json();
    },
  });
}

export function useRegencies(provinceId?: number) {
  return useQuery({
    queryKey: ['regencies', provinceId],
    queryFn: async () => {
      if (!provinceId) return [];
      const res = await fetch(`${BASE_URL}/${provinceId}/regencies.json`);
      return res.json();
    },
    enabled: !!provinceId,
  });
}

export function useDistricts(provinceId?: number, regencyId?: number) {
  return useQuery({
    queryKey: ['districts', provinceId, regencyId],
    queryFn: async () => {
      if (!provinceId || !regencyId) return [];
      const res = await fetch(`${BASE_URL}/${provinceId}/${regencyId}/district.json`);
      return res.json();
    },
    enabled: !!provinceId && !!regencyId,
  });
}

export function useSubdistricts(
  provinceId?: number,
  regencyId?: number,
  districtId?: number,
) {
  return useQuery({
    queryKey: ['subdistricts', provinceId, regencyId, districtId],
    queryFn: async () => {
      if (!provinceId || !regencyId || !districtId) return [];
      const res = await fetch(
        `${BASE_URL}/${provinceId}/${regencyId}/${districtId}/subdistrict.json`,
      );
      return res.json();
    },
    enabled: !!provinceId && !!regencyId && !!districtId,
  });
}
