import {createApi} from '@reduxjs/toolkit/query/react';
import fetchBase from '../fetchBase';
import {Service} from '../../types/services';

interface GetServicesRequest {
  services: any;
}
interface AddServiceRequest {
  ok: boolean;
  service: Service;
}
export const servicesApi = createApi({
  baseQuery: fetchBase,
  reducerPath: 'servicesApi',
  endpoints: builder => ({
    addService: builder.mutation<AddServiceRequest, FormData>({
      query: credentials => ({
        url: '/services/add',
        method: 'POST',
        body: credentials,
        formData:true
      }),
    }),
    
    getServices: builder.query<GetServicesRequest, void>({
      query() {
        console.log('fetching');
        return {
          url: `/services/`,
        };
      },
    }),
  }),
});

export const {useGetServicesQuery, useAddServiceMutation} = servicesApi;
