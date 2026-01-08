import api from "./api";

type UserListParams = {
  role?: "ADMIN" | "ZONE_MANAGER" | "DOULA" | "CLIENT";
  page?: number;
  limit?: number;
  is_active?: boolean;
  search?: string;
};

export const fetchUsersList = async (params?: UserListParams) => {
  const res = await api.get("/analytics/user/list", {
    params,
  });
  return res.data;
};

export const fetchUserCounts = async (
  regionId?: string,
  role?: string,
  is_active?: boolean
) => {
  const res = await api.get("/analytics/counts/user", {
    params: {
      regionId,
      role,
      is_active,
    },
  });
  return res.data;
};

export const fetchBookingCounts = async (regionId?: string) => {
  const res = await api.get("/analytics/counts/booking", {
    params: {
      regionId,
    },
  });
  return res.data;
};

export const fetchMeetingCounts = async (regionId?: string) => {
  const res = await api.get("/analytics/counts/meeting", {
    params: {
      regionId,
    },
  });
  return res.data;
};

export const fetchDailyActivity = async () => {
  const res = await api.get("/analytics/daily-activity");
  return res.data;
};
