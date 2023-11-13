import { createApi } from '@reduxjs/toolkit/query/react'
import fetchBase from '../fetchBase'

export interface User {

  _id: string
  name: string
  lastname: string
  email: string
  password: string
  resetToken: string
  resetTokenExpiresAt: string
  avatar: string
  role: string
  createdAt: string
}

export interface UserResponse {
  token: string
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
  id: string
  data: FormData
}
interface MeRequest{
  data:User
}


export const authApi = createApi({
  baseQuery: fetchBase,
  reducerPath: 'authApi',
  endpoints: (builder) => ({
    login: builder.mutation<UserResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials
      })
    }),
    getMe: builder.query<MeRequest, void>({
      query() {
        return {
          url: `/auth/me`
        }
      }
    })
    // updateUserProfile: builder.mutation<GenericResponse, UpdateProfilerRequest>(
    //   {
    //     query(args) {
    //       return {
    //         url: `user/${args.id}`,
    //         method: 'PACHT',
    //         body: args.data,
    //         formData:true,
    //       }
    //     }
    //   }
    // )
  })
})

export const { useLoginMutation, useGetMeQuery} = authApi
