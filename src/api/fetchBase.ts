import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError
} from '@reduxjs/toolkit/query'

import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import { type RootState } from '../store'
import { logout } from '../store/features/authSlice'

//let baseUrl :string = `https://barbershop-backend-ozy5.onrender.com/api`
let baseUrl : string = "http://192.168.100.3:4000/api"
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
  const result = await baseQuery(args, api, extraOptions)
  console.log(result)
  if (
    result.error != null &&
    (result.error.status === 401 || result.error.status === 500)
  ) {
    api.dispatch(logout())
  }
  return result
}
export default fetchBase
