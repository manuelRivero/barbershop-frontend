import {createApi} from '@reduxjs/toolkit/query/react';
import fetchBase from '../fetchBase';
import {Service} from '../../types/services';

interface GetServicesResponse {
  services: any;
}
interface AddServiceRequest {
  ok: boolean;
  service: Service;
}
interface GetBarberServicesResponse {
  services: any;
}
interface GetBarberServicesRequest {
  id:number
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
    
    getServices: builder.query<GetServicesResponse, void>({
      query() {
        console.log('fetching');
        return {
          url: `/services/`,
        };
      },
    }),
    getBarberServices: builder.query<GetBarberServicesResponse, GetBarberServicesRequest>({
      query(args) {
        console.log('fetching');
        return {
          url: `/services/${args.id}`,
        };
      },
    }),
  }),
});

export const {useGetServicesQuery, useAddServiceMutation, useGetBarberServicesQuery} = servicesApi;
