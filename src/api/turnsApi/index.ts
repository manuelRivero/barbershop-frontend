import { createApi } from '@reduxjs/toolkit/query/react';
import fetchBase from '../fetchBase';
import { Event } from '../../types/turns';
import { User } from '../../types/user';

interface GetServicesRequest {
  services: any;
}

interface GetTurnsResponse extends Event {
  turns: OverridedEvent[]
}
export interface OverridedEvent extends Omit<Event, 'user'> {
  user: User[]
}
interface AddTurnResponse {
  ok: boolean;
  turn: Event;
}
export interface setEvent extends Omit<Event, 'user'> {
  user: string | null
}
interface AddTurnRequest {
  data: setEvent;
}
interface GetTurnsRequest {
  id: number | string;
  date?: string
}
interface GetTurnsDetailRequest {
  id: number | string;
}
interface CompleteTurnRequest {
  id: string | undefined
}
interface CompleteTurnResponse {
  ok: boolean
}
interface CancelTurnRequest {
  id: string | undefined
  reason: string
}
interface CancelTurnResponse {
  ok: boolean
}
export const turnsApi = createApi({
  baseQuery: fetchBase,
  reducerPath: 'turnsApi',
  tagTypes: ['TURNS'],
  endpoints: builder => ({
    addTurn: builder.mutation<AddTurnResponse, AddTurnRequest>({
      query: args => {
        console.log("args", args)
        return ({
          url: '/turns/set',
          method: 'POST',
          body: args.data,
        })
      },
    }),

    completeTurn: builder.mutation<CompleteTurnResponse, CompleteTurnRequest>({
      query: args => {
        return ({
          url: '/turns/complete',
          method: 'PUT',
          body: { id: args.id },
        })
      },
    }),

    cancelTurn: builder.mutation<CancelTurnResponse, CancelTurnRequest>({
      invalidatesTags:["TURNS"],
      query: args => {
        return ({
          url: '/turns/canceled',
          method: 'PUT',
          body: { id: args.id, reason:args.reason },
        })
      },
    }),

    getTurns: builder.query<Event[], GetTurnsRequest>({
      providesTags:["TURNS"],
      keepUnusedDataFor: 0,
      query: args => {
        return ({
          url: '/turns/get/' + args.id,
          params: {date:args.date}
        })
      },
      transformResponse: (response: GetTurnsResponse) => {
        return response.turns.map(e => ({ ...e, user: e.user[0] }))
      },
    }),
    getActiveTurn: builder.query<any, void>({
      query: () => {
        return ({
          url: '/turns/get-active/',
        })
      },
    }),
    cencelTurnUser: builder.mutation<any, any>({
      invalidatesTags:["TURNS"],

      query: (args) => {
        return ({
          method:"DELETE",
          url: '/turns/'+ args.id,
          body:{
            reason: args.reason
          }
        })
      },
    }),
    getTurnDetails: builder.query<any, GetTurnsDetailRequest>({
      providesTags:["TURNS"],
      keepUnusedDataFor: 0,
      query: args => {
        return ({
          url: '/turns/detail/' + args.id,
        })
      },
    })
  }),
});

export const { useCencelTurnUserMutation, useAddTurnMutation, useGetTurnsQuery, useGetTurnDetailsQuery, useGetActiveTurnQuery, useCompleteTurnMutation, useCancelTurnMutation } = turnsApi;
