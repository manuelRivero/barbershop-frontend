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
  }),
});

export const {useAddTurnMutation} = turnsApi;
