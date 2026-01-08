import api from "./api";

export interface DoulaListItem {
  userId: string;
  name: string;
  email: string;
  profileId: string;
  profileImage: string | null;
  yoe: number;
  serviceNames: string[];
  regionNames: string[];
  ratings: number | null;
  reviewsCount: number;
  nextImmediateAvailabilityDate: string | null;
  isActive: boolean;
}

export const fetchAdminDoulas = async (params?: {
  search?: string;
  page?: number;
  limit?: number;
  service?: string;
  regionName?: string;
  availability?: "AVAILABLE" | "UNAVAILABLE";
  status?: "ACTIVE" | "INACTIVE";
}) => {
  const cleanParams: any = {};

  if (params?.search) cleanParams.search = params.search;
  if (params?.page) cleanParams.page = params.page;
  if (params?.limit) cleanParams.limit = params.limit;
  if (params?.service) cleanParams.serviceName = params.service;
  if (params?.availability)
    cleanParams.isAvailable = params.availability === "AVAILABLE";
  if (params?.status)
    cleanParams.isActive = params.status === "ACTIVE";

  if (params?.regionName) cleanParams.regionName = params.regionName;

  const res = await api.get("/doula", { params: cleanParams });

  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

  const doulas: DoulaListItem[] = res.data.data.map((d: any) => ({
    userId: d.userId,
    name: d.name,
    email: d.email,
    profileId: d.profileId,
    yoe: d.yoe ?? 0,
    serviceNames: (d.serviceNames ?? []).map((s: any) =>
      s.serviceName ?? s
    ),
    regionNames: (d.regionNames ?? []).map((r: any) => r.name),
    ratings: d.ratings ?? null,
    reviewsCount: d.reviewsCount ?? 0,
    nextImmediateAvailabilityDate: d.nextImmediateAvailabilityDate ?? null,
    profileImage: d.profile_image
      ? `${IMAGE_BASE_URL}/${d.profile_image}`
      : null,
    isActive: d.isActive,
  }));

  return {
    doulas,
    total: res.data.meta.total,
    totalPages: res.data.meta.totalPages,
  };
};

export const deleteDoula = async (id: string) => {
  return api.delete(`/doula/${id}`);
};

export interface Service {
  id: string;
  name: string;
}

export const fetchServices = async (): Promise<Service[]> => {
  const res = await api.get("/services");
  return res.data.data as Service[];
};