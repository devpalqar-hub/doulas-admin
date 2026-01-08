import api from "./api";

export type AdminMeeting = {
  id: string;
  status: string;
  date: string;
  startTime: string;
  endTime: string;
  serviceName: string;
  remarks?: string;
  link: string;
  enquiry: {
    name: string;
    email: string;
    phone: string;
    meetingsTimeSlots: string;
  };
  ZoneManagerProfile?: {
    user?: {
      name: string;
      email: string;
    };
  };
};

type FetchAdminMeetingsParams = {
  date1?: string;
  date2?: string;
  status?: string;
  serviceId?: string;
  regionId?: string;
  zoneManagerId?: string;
  meetingId?: string;
  page: number;
  limit: number;
};

export const fetchAdminMeetings = async (filters: FetchAdminMeetingsParams) => {
  const params: any = {};

  params.page = filters.page;
  params.limit = filters.limit;

  if (filters.meetingId?.trim()) {
    params.meetingId = filters.meetingId.trim();
  }

  if (filters.serviceId) {
    params.serviceId = filters.serviceId;
  }

  if (filters.status) {
    params.status = filters.status;
  }

  if (filters.date1) {
    params.date1 = new Date(filters.date1).toISOString();
  }

  if (filters.date2) {
    params.date2 = new Date(filters.date2).toISOString();
  }

  if (filters.regionId) {
    params.regionId = filters.regionId;
  }

  if (filters.zoneManagerId) {
    params.zoneManagerId = filters.zoneManagerId;
  }

  const res = await api.get(
    "/service-booked/meetings/list/admin",
    { params }
  );

  return {
    meetings: res.data.data,
    meta: res.data.meta,
  };
};
export const fetchAdminMeetingById = async (id: string) => {
  const res = await api.get(
    `/service-booked/meetings/list/admin/${id}`
  );

  return res.data.data;
};
