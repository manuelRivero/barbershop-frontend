import {createApi} from '@reduxjs/toolkit/query/react';
import fetchBase from '../fetchBase';
import {Service} from '../../types/services';
import moment from 'moment';

interface GetWeekStatsResponse {
  data: any;
}
interface GetWeekStatsRequest {
  id: string | null
  from: Date
  to: Date
}
interface GetStatsFromDatesRequest {
  from: Date
  to: Date
}


export const statApi = createApi({
  baseQuery: fetchBase,
  reducerPath: 'statApi',
  endpoints: builder => ({
 
    
    getWeekStats: builder.query<GetWeekStatsResponse, GetWeekStatsRequest>({
      query(args) {
        return {
          url: `/stats/get-week-stats`,
          params:{
            id: args.id,
            from: args.from,
            to: args.to
          }
        }
      },
    }),
    getAllStatsFromDates: builder.query<GetWeekStatsResponse, GetStatsFromDatesRequest>({
      query(args) {
        return {
          url: `/stats/get-all-stats-from-dates`,
          params:{
            from: args.from,
            to: args.to
          }
        }
      },
    }),
  })
});

export const {useGetWeekStatsQuery, useGetAllStatsFromDatesQuery} = statApi;
