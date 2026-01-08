import api from "./api";

export type Region = {
  regionId: string;
  regionName: string;
  pincode: string;
  district: string;
  state: string;
  country: string;
  latitude: string;
  longitude: string;
  is_active: boolean;
  zoneManagerId: string | null;
};

export const fetchRegions = async (): Promise<Region[]> => {
  const res = await api.get("/regions", {
    params: { page: 1, limit: 100 },
  });

  return res.data.data as Region[];
};

/* GET REGIONS */
export const fetchRegionsAdmin = async (params: {
  page: number;
  limit: number;
  search?: string;
}) => {
  const res = await api.get("/regions", { params });

  return {
    regions: res.data.data as Region[],
    meta: res.data.meta,
  };
};

/* GET REGION BY ID */
export const fetchRegionById = async (id: string): Promise<Region> => {
  const res = await api.get(`/regions/${id}`);
  return res.data.data;
};

export type CreateRegionPayload = {
  regionName: string;
  pincode: string;
  district: string;
  state: string;
  country: string;
  latitude: string;
  longitude: string;
  is_active: boolean;
};

export const createRegion = async (payload: CreateRegionPayload) => {
  const res = await api.post("/regions", payload);
  return res.data.data;
};

export const updateRegion = async (
  id: string,
  payload: Partial<CreateRegionPayload>
) => {
  const res = await api.put(`/regions/${id}`, payload);
  return res.data.data;
};
