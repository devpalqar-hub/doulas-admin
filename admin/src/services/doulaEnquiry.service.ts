import api from "./api";

export type DoulaEnquiryStatus =
  | "PENDING"
  | "IN_REVIEW"
  | "ACCEPTED"
  | "REJECTED";

export interface DoulaEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: DoulaEnquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DoulaEnquiryResponse {
  data: DoulaEnquiry[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const fetchDoulaJoinEnquiries = async ({
  status,
  page,
  limit,
}: {
  status?: string;
  page: number;
  limit: number;
}): Promise<DoulaEnquiryResponse> => {
  const res = await api.get("/doula-join-enquiries", {
    params: { status, page, limit },
  });

  return res.data;
};

export const updateDoulaEnquiryStatus = async (
  enquiry: DoulaEnquiry,
  newStatus: DoulaEnquiryStatus
) => {
  await api.patch(`/doula-join-enquiries/${enquiry.id}`, {
    name: enquiry.name,
    email: enquiry.email,
    phone: enquiry.phone,
    status: newStatus,
  });
};
