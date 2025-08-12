import StoreShippingDTO from '@/dto/dto'
import { api } from './api.config'
// import { ApiResponse } from '@/pages/auth/Auth.type'
import { GetPaymentMethodListResponseDto } from '@/types/PaymentMethodListResponse.type'
import { PSASettingsDTO, Store } from '@/dto/Store.dto'
import { BasicResponse } from '@/types/basicResponse.type'
import { ApiResponse } from '@/types'

export const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPsaSettings: builder.query<ApiResponse<PSASettingsDTO>, void>({
      query: () => ({
        url: '/admin/psa-settings/list',
        headers: { hideToast: 'true' },
      }),
    }),
    psaSettingsSave: builder.mutation<BasicResponse, PSASettingsDTO>({
      query: (body) => ({
        url: '/admin/psa-settings/save',
        method: 'POST',
        body,
      }),
    }),
    psaShipping: builder.mutation<void, StoreShippingDTO>({
      query: (body) => ({
        url: '/admin/store-shipping/save',
        method: 'POST',
        body,
        headers: { hideToast: 'false' },
      }),
    }),
    getShipping: builder.query<any, void>({
      query: () => ({
        url: '/admin/store-shipping/list',
        method: 'GET',
        headers: { hideToast: 'true' },
      }),
    }),
    getPaymentMethodList: builder.query<GetPaymentMethodListResponseDto, void>({
      query: () => ({
        url: '/admin/payment-methods/list',
        method: 'GET',
        headers: { hideToast: 'true' },
      }),
    }),
    savePaymentMethodList: builder.mutation<BasicResponse, {}>({
      query: (body) => ({
        url: 'admin/payment-methods/save',
        method: 'POST',
        body,
        headers: { hideToast: 'false' },
      }),
    }),
    getSyncNow: builder.query<BasicResponse, void>({
      query: () => ({
        url: '/admin/submission/sync-psa',
        headers: { hideToast: 'false' },
      }),
    }),
    getStoreDetails: builder.query<ApiResponse<Store>, void>({
      query: () => ({ url: 'admin/store-settings/storeDetails', headers: { hideToast: 'true' } }),
    }),

    updateStoreDetails: builder.mutation<BasicResponse, { name: string; currency_code: string }>({
      query: (data) => ({
        url: 'admin/store-settings/update',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['PROFILE_DETAILS'],
    }),
  }),
})

export const {
  useLazyGetSyncNowQuery,
  useGetPsaSettingsQuery,
  usePsaSettingsSaveMutation,
  usePsaShippingMutation,
  useGetShippingQuery,
  useGetPaymentMethodListQuery,
  useSavePaymentMethodListMutation,
  useGetStoreDetailsQuery,
  useUpdateStoreDetailsMutation,
} = extendedApi
