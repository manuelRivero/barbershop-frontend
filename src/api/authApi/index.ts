import { createApi } from '@reduxjs/toolkit/query/react'
import fetchBase from '../fetchBase'
import { User } from '../../types/user'

interface UpdateProfilerResponse {
  targetUser: User
}

export interface UserResponse {
  token: string
  refreshToken: string
}

export interface LoginRequest {
  email: string
  password: string
}
export interface RegisterRequest {
  name: string
  lastname: string
  email: string
  password: string
  bankAccount: number
  bankAccountType: string
  odalaUser: boolean
  bank: string
  role: string
  confirm_password?: string
}

export interface UpdateProfilerRequest {
  data: FormData
}
interface MeRequest{
  data:User
}


export const authApi = createApi({
  baseQuery: fetchBase,
  reducerPath: 'authApi',
  tagTypes: ["Me"],
  endpoints: (builder) => ({
    login: builder.mutation<UserResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
        invalidateTags: ['Me']
      })
    }),
    getMe: builder.query<MeRequest, {}>({
      query() {
        return ({
          url: `/auth/me`,
          providesTags: ['Me']
        })
      }
    }),
    refreshToken: builder.mutation<any, {}>({
      query: (args) => ({
          url: `/auth/token`,
          method: 'POST',
          body: args
      })
    }),
    updateUserProfile: builder.mutation<UpdateProfilerResponse, UpdateProfilerRequest>(
      {
        query(args) {
          return {
            url: `/auth/edit-profile`,
            method: 'PUT',
            body: args.data,
            formData:true,
          }
        }
      }
    )
  })
})

export const { useLoginMutation, useGetMeQuery, useUpdateUserProfileMutation } = authApi
