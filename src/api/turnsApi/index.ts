import { createApi } from '@reduxjs/toolkit/query/react';
import fetchBase from '../fetchBase';
import { Event } from '../../types/turns';

interface GetServicesRequest {
  services: any;
}
interface AddTurnResponse {
  ok: boolean;
  turn: Event;
}
interface AddTurnRequest {
  data: Event;
}
interface GetTurnsRequest {
  id: number | string;
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
}
interface CancelTurnResponse {
  ok: boolean
}
export const turnsApi = createApi({
  baseQuery: fetchBase,
  reducerPath: 'turnsApi',
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
          body: {id:args.id},
        })
      },
    }),

    cancelTurn: builder.mutation<CancelTurnResponse, CancelTurnRequest>({
      query: args => {
        return ({
          url: '/turns/canceled',
          method: 'PUT',
          body: {id:args.id},
        })
      },
    }),

    getTurns: builder.query<any, GetTurnsRequest>({
      query: args => {
        return ({
          url: '/turns/get/' + args.id,
        })
      },
    }),
    getActiveTurn: builder.query<any, void>({
      query: () => {
        console.log("User turn endpoint")
        return ({
          url: '/turns/get-active/',
        })
      },
    }),
    getTurnDetails: builder.query<any, GetTurnsDetailRequest>({
      query: args => {
        console.log("request")
        return ({
          url: '/turns/detail/' + args.id,
        })
      },
    })
  }),
});

export const { useAddTurnMutation, useGetTurnsQuery, useGetTurnDetailsQuery, useGetActiveTurnQuery, useCompleteTurnMutation, useCancelTurnMutation } = turnsApi;
