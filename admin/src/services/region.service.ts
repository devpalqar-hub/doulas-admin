import api from "./api";

export interface Region {
  regionId: string;
  regionName: string;
}

export const fetchRegions = async (): Promise<Region[]> => {
  const res = await api.get("/regions", {
    params: { page: 1, limit: 100 },
  });

  return res.data.data as Region[];
};
