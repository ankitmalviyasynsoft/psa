import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { api } from '../api/api.config'
import { rtkQueryLogger } from '../api/api.util'
import { authSlice } from '../slice/auth.slice'
import { profileSlice } from '../slice/profile.slice'
import { storeData } from '../slice/selectedStore'
import { newSubmissionSlice } from '../slice/newSubmission.slice'
import { selectedServiceSlice } from '../slice/selectedService.slice'
import { customerProfileSlice } from '../slice/customerProfile.slice'
import { tcgApi } from '../api/tcg.api'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [profileSlice.name]: profileSlice.reducer,
    [authSlice.name]: authSlice.reducer,
    [storeData.name]: storeData.reducer,
    [newSubmissionSlice.name]: newSubmissionSlice.reducer,
    [selectedServiceSlice.name]: selectedServiceSlice.reducer,
    [customerProfileSlice.name]: customerProfileSlice.reducer,
    [tcgApi.reducerPath]: tcgApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware, tcgApi.middleware, rtkQueryLogger),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
