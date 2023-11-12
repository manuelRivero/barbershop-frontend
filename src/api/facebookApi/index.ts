import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import fetchBase from '../fetchBase'
import { url } from 'inspector'
import { UserResponse } from '../authApi'



export const facebookApi = createApi({
  baseQuery: fetchBase,
  reducerPath: 'facebookApi',
  endpoints: (builder) => ({
   
    facebookLogin: builder.mutation<UserResponse, any>({
      query(args) {
        return {
          url: `/auth/facebook-login`,
          body:{access_token:args.token},
          method:'POST'
        }
      }
    })
  })
})

export const { useFacebookLoginMutation } = facebookApi
