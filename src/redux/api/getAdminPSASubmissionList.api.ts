import { api } from './api.config'
import { TPaginationApiParams } from '@/types/PaginationApiParams.type'

export const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPSASubmissionList: builder.query<any, TPaginationApiParams>({
      query: ({ searchVal, page, limit }) => ({
        url: `/admin/submission/list?page=${page}&limit=${limit}&sortOrder=desc&searchVal=${searchVal}`,
        method: 'GET',
        headers: { hideToast: 'true' },
      }),
      providesTags: ['PSA_SUBMISSION'],
    }),
    getPSACustomerSubmission: builder.query<any, TPaginationApiParams>({
      query: ({ searchVal, page, limit, payment_status, payment_method, selectedOrdersId, onlySubmissionsAvail = false }) => ({
        url: `admin/submission/customer?page=${page}&limit=${limit}&sortOrder=desc&searchVal=${searchVal}&payment_status=${payment_status}&payment_method=${payment_method}&selectedOrdersId=${selectedOrdersId}&onlySubmissionsAvail=${onlySubmissionsAvail}`,
        method: 'GET',
        headers: { hideToast: 'true' },
      }),
    }),
    getAwaitingSubmission: builder.query<any, TPaginationApiParams>({
      query: ({ searchVal, page, limit, payment_status, payment_method }) => ({
        url: `admin/submission/awaiting-submission?page=${page}&limit=${limit}&sortOrder=desc&searchVal=${searchVal}&payment_status=${payment_status}&payment_method=${payment_method}`,
        method: 'GET',
        headers: { hideToast: 'true' },
      }),
    }),
    getSubmissionUpdateStatus: builder.mutation<any, {}>({
      query: (body) => ({
        url: `admin/submission/update-status`,
        method: 'POST',
        headers: { hideToast: 'false' },
        body,
      }),
    }),
    updateUpcharge: builder.mutation<any, {}>({
      query: (body) => ({
        url: `admin/submission/add-order-upcharge`,
        method: 'POST',
        headers: { hideToast: 'false' },
        body,
      }),
    }),
    getSubmissionTempUpdateStatus: builder.mutation<any, {}>({
      query: (body) => ({
        url: `admin/submission/update-status-submission-temp`,
        method: 'POST',
        headers: { hideToast: 'false' },
        body,
      }),
    }),
    createTempSubmission: builder.mutation<any, {}>({
      query: (body) => ({
        url: `admin/submission/create-draft-submission`,
        method: 'POST',
        headers: { hideToast: 'false' },
        body,
      }),
    }),
    deleteTempSubmission: builder.mutation<any, {}>({
      query: (body) => ({
        url: `admin/submission/update-draft-submission`,
        method: 'POST',
        headers: { hideToast: 'false' },
        body,
      }),
      invalidatesTags: ['PSA_SUBMISSION'],
    }),

    updatePaymentStatus: builder.mutation<any, { uuid: string }>({
      query: (body) => ({
        url: `admin/submission/update-payment-status`,
        method: 'POST',
        headers: { hideToast: 'false' },
        body,
      }),
    }),
    getSubmissionDetailsById: builder.query<any, TPaginationApiParams>({
      query: ({ id, searchVal, page, limit }) => ({
        url: `admin/submission/${id}?page=${page}&limit=${limit}&sortOrder=desc&searchVal=${searchVal}`,
        method: 'GET',
        headers: { hideToast: 'true' },
      }),
    }),
    getTempSubmissionById: builder.query<any, any>({
      query: ({ id }) => ({
        url: `admin/submission/getAllCardsWithSameTempNum/${id}`,
        method: 'GET',
        headers: { hideToast: 'true' },
      }),
      providesTags: ['TEMP_SUBMISSION_BY_ID'],
    }),
    getAllOrderBySubmissionNumber: builder.query<any, TPaginationApiParams>({
      query: ({ submissionNumber, searchVal, page, limit }) => ({
        url: `/admin/submission/getAllOrderBySubmissionNumber/${submissionNumber}&page=${page}&limit=${limit}&sortOrder=desc&searchVal=${searchVal}`,
        headers: { hideToast: 'true' },
      }),
    }),
  }),
})

export const {
  useCreateTempSubmissionMutation,
  useGetPSACustomerSubmissionQuery,
  useGetAwaitingSubmissionQuery,
  useGetSubmissionUpdateStatusMutation,
  useUpdateUpchargeMutation,
  useGetSubmissionTempUpdateStatusMutation,
  useGetPSASubmissionListQuery,
  useGetSubmissionDetailsByIdQuery,
  useUpdatePaymentStatusMutation,
  useDeleteTempSubmissionMutation,
  useLazyGetTempSubmissionByIdQuery,
  useGetAllOrderBySubmissionNumberQuery,
} = extendedApi
