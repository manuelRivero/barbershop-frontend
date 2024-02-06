import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta
} from '@reduxjs/toolkit/query'

import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import { type RootState } from '../store'
import { setToken, logout, selectRefreshToken } from '../store/features/authSlice'
import { authApi } from './authApi'

let baseUrl: string = `https://barbershop-backend-ozy5.onrender.com/api`
// let baseUrl : string = "http://192.168.100.3:4000/api"
// let baseUrl : string = "http://192.168.100.48:4000/api"
const baseQuery = fetchBaseQuery({

  baseUrl,
  credentials: 'same-origin',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  }
})

const fetchBase: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error != null && result.error.status === 401) {
    const response: any = await baseQuery({ url: '/auth/token', method: 'post', body: { token: selectRefreshToken(api.getState() as RootState) } }, api, extraOptions)
    console.log("response", response)
    if (response.error) {
      api.dispatch(logout())
    } else {
      api.dispatch(setToken({ token: response.data.token, refreshToken: response.data.refreshToken }))
      result = await baseQuery(args, api, extraOptions)
    }


  };
  console.log("result",result)

  return result
}
export default fetchBase
