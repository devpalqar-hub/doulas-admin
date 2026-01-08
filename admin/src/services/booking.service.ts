import api from "./api";

export type AdminBooking = {
  bookingId: string;
  clientName: string;
  clientUserId: string;

  doulaName: string;
  doulaUserId: string;

  serviceName: string;
  serviceId: string;

  regionId: string;
  regionName: string;

  startDate: string;
  endDate: string;
  timeShift: string;

  status: string;
  isPaid: boolean;
};

export const fetchAdminBookings = async (filters: {
  search?: string;
  serviceId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  regionId?: string;
}) => {
  const res = await api.get("/service-booked", {
    params: {
      search: filters.search || undefined,
      serviceId: filters.serviceId || undefined,
      status: filters.status || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      page: filters.page ?? 1,
      limit: filters.limit ?? 10,
      regionId: filters.regionId || undefined,
    },
  });

  const bookings: AdminBooking[] = res.data.data.map((b: any) => ({
    bookingId: b.bookingId,
    clientName: b.clientName,
    clientUserId: b.clientUserId,
    doulaName: b.doulaName,
    doulaUserId: b.doulaUserId,
    serviceName: b.serviceName,
    serviceId: b.serviceId,
    regionId: b.regionId,
    regionName: b.regionName,
    startDate: b.start_date,
    endDate: b.end_date,
    timeShift: b.timeShift,
    status: b.status,
    isPaid: b.isPaid,
  }));

  return {
    bookings,
    meta: res.data.meta,
  };
};

export const updateAdminBookingStatus = async (
  bookingId: string,
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELED"
) => {
  await api.patch(`/service-booked/bookings/${bookingId}/status`, {
    status,
  });
};

