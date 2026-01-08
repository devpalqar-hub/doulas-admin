import api from "./api";

export const fetchAdminRevenue = async (filters: {
  doulaId?: string;
  regionId?: string;
  serviceId?: string;
  date1?: string;
  date2?: string;
}) => {
  const res = await api.get("/analytics/revenue/total", {
    params: {
      doulaId: filters.doulaId || undefined,
      regionId: filters.regionId || undefined,
      serviceId: filters.serviceId || undefined,
      date1: filters.date1 || undefined,
      date2: filters.date2 || undefined,
    },
  });

  return {
    totalRevenue: res.data.data.totalRevenue ?? 0,
    currency: res.data.data.currency ?? "INR",
  };
};
