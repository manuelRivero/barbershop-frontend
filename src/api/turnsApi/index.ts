import {createApi} from '@reduxjs/toolkit/query/react';
import fetchBase from '../fetchBase';
import {Event} from '../../types/turns';

interface GetServicesRequest {
  services: any;
}
interface AddTurenResponse {
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
export const turnsApi = createApi({
  baseQuery: fetchBase,
  reducerPath: 'turnsApi',
  endpoints: builder => ({
    addTurn: builder.mutation<AddTurenResponse, AddTurnRequest>({
      query: args => {
        console.log("args", args)
        return({
        url: '/turns/set',
        method: 'POST',
        body: args.data,
      })},
    }),
    
    getTurns: builder.query<any, GetTurnsRequest>({
      query: args => {
        return({
        url: '/turns/get/'+ args.id,
      })},
    }),
    getActiveTurn: builder.query<any, void>({
      query: () => {
        console.log("User turn endpoint")
        return({
        url: '/turns/get-active/',
      })},
    }),
    getTurnDetails: builder.query<any, GetTurnsDetailRequest>({
      query: args => {
        console.log("request")
        return({
        url: '/turns/detail/'+ args.id,
      })},
    })
  }),
});

export const {useAddTurnMutation , useGetTurnsQuery, useGetTurnDetailsQuery, useGetActiveTurnQuery } = turnsApi;
