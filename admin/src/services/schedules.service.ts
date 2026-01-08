import api from "./api";

export type AdminSchedule = {
  id: string;
  date: string;
  timeshift: "MORNING" | "NIGHT" | "FULLDAY";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";

  DoulaProfile?: {
    user?: {
      name: string;
      email: string;
    };
  };

  ServicePricing?: {
    service?: {
      name: string;
    };
  };

  serviceBooking?: {
    totalAmount?: string;
    region?: {
      id: string;
      regionName: string;
    };
  };

  client?: {
    user?: {
      name: string;
      email: string;
    };
  };
};


type FetchAdminSchedulesParams = {
  date1?: string;
  date2?: string;
  status?: string;
  timeshift?: string;
  doulaId?: string;
  regionId?: string;
  serviceId?: string;
  page: number;
  limit: number;
};

export const fetchAdminSchedules = async (
  filters: FetchAdminSchedulesParams
) => {
  const params: any = {
    page: filters.page,
    limit: filters.limit,
  };

  if (filters.status) params.status = filters.status;
  if (filters.timeshift) params.timeshift = filters.timeshift;
  if (filters.serviceId) params.serviceId = filters.serviceId;
  if (filters.regionId) params.regionId = filters.regionId;
  if (filters.doulaId) params.doulaId = filters.doulaId;
  if (filters.date1) params.date1 = new Date(filters.date1).toISOString();
  if (filters.date2) params.date2 = new Date(filters.date2).toISOString();

  const res = await api.get(
    "/service-booked/schedules/list/admin",
    { params }
  );

  return {
    schedules: res.data.data,
    meta: res.data.meta,
  };
};

export const updateAdminScheduleStatus = async (
  scheduleId: string,
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED"
) => {
  await api.patch(`/service-booked/schedules/${scheduleId}/status`, {
    status,
  });
};
