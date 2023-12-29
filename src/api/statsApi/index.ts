import {createApi} from '@reduxjs/toolkit/query/react';
import fetchBase from '../fetchBase';
import {Service} from '../../types/services';

interface GetWeekStatsResponse {
  data: any[];
}


export const statApi = createApi({
  baseQuery: fetchBase,
  reducerPath: 'statApi',
  endpoints: builder => ({
 
    
    getWeekStats: builder.query<GetWeekStatsResponse, void>({
      query() {
        return {
          url: `/stats/get-week-stats`,
        };
      },
    }),
  })
});

export const {useGetWeekStatsQuery} = statApi;
