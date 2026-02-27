import api from "./api";

export type AdminTestimonial = {
  id: string;
  ratings: number;
  reviews: string;
  createdAt: string;

  client?: {
    user?: {
      name: string;
      email: string;
      phone: string;
    };
  };

  DoulaProfile?: {
    user?: {
      name: string;
      email: string;
      phone: string;
    };
    Region?: {
      regionName: string;
      state: string;
      country: string;
    }[];
  };

  ServicePricing?: {
    service?: {
      name: string;
      description: string;
    };
  };
};

type FetchAdminTestimonialsParams = {
  doulaId?: string;
  serviceId?: string;
  ratings?: number;
  date1?: string;
  date2?: string;
  page: number;
  limit: number;
};

export const fetchAdminTestimonials = async (
  filters: FetchAdminTestimonialsParams
) => {
  const params: any = {
    page: filters.page,
    limit: filters.limit,
  };

  if (filters.doulaId) params.doulaId = filters.doulaId;
  if (filters.serviceId) params.serviceId = filters.serviceId;
  if (filters.ratings) params.ratings = filters.ratings;
  if (filters.date1 && !isNaN(Date.parse(filters.date1))) {
    params.date1 = new Date(filters.date1).toISOString();
  }

  if (filters.date2 && !isNaN(Date.parse(filters.date2))) {
    params.date2 = new Date(filters.date2).toISOString();
  }

  const res = await api.get(
    "/service-booked/testimonials/list/admin",
    { params }
  );

  return {
    testimonials: res.data.data,
    meta: res.data.meta,
  };
};

export const fetchAdminTestimonialById = async (id: string) => {
  const res = await api.get(
    `/service-booked/testimonials/list/admin/${id}`
  );

  return res.data.data;
};
