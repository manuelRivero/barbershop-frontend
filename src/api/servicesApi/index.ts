import { createApi } from '@reduxjs/toolkit/query/react'
import fetchBase from '../fetchBase'

interface GetServicesRequest {
    services:any
}
export const servicesApi = createApi({
  baseQuery: fetchBase,
  reducerPath: 'servicesApi',
  endpoints: (builder) => ({
    // login: builder.mutation<UserResponse, LoginRequest>({
    //   query: (credentials) => ({
    //     url: 'auth/login',
    //     method: 'POST',
    //     body: credentials
    //   })
    // }),
    getServices: builder.query<GetServicesRequest, void>({
      query() {
        console.log("fetching")
        return {
          url: `/services/`
        }
      }
    })
  })
})

export const { useGetServicesQuery} = servicesApi
