import { createApi } from '@reduxjs/toolkit/query/react';
import fetchBase from '../fetchBase';
import { Service } from '../../types/services';

interface GetServicesResponse {
  services: any;
}
interface AddServiceResponse {
  ok: boolean;
  service: Service;
}
interface EditServiceResponse {
  ok: boolean;
  targetService: Service;
}

interface GetBarberServicesResponse {
  services: any;
}
interface GetBarberServicesRequest {
  id: number
}
export const servicesApi = createApi({
  baseQuery: fetchBase,
  reducerPath: 'servicesApi',
  endpoints: builder => ({
    addService: builder.mutation<AddServiceResponse, FormData>({
      query: credentials => ({
        url: '/services/add',
        method: 'POST',
        body: credentials,
        formData: true,
      }),
    }),

    editServices: builder.mutation<EditServiceResponse, FormData>({
      
      query: args => {
        console.log('fetching');
        return ({
        url: '/services/edit/',
        method: 'PATCH',
        body: args,
        formData: true
      })},
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

export const { useGetServicesQuery, useAddServiceMutation, useGetBarberServicesQuery, useEditServicesMutation } = servicesApi;
