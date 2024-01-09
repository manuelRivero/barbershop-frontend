import {createApi} from '@reduxjs/toolkit/query/react';
import fetchBase from '../fetchBase';
import {Service} from '../../types/services';

interface GetWeekStatsResponse {
  data: any[];
}
interface GetWeekStatsRequest {
  id: string | null
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
            id: args.id
          }
        }
      },
    }),
  })
});

export const {useGetWeekStatsQuery} = statApi;
