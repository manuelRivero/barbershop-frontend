import { createApi } from '@reduxjs/toolkit/query/react';
import fetchBase from '../fetchBase';
import { User } from '../../types/user';

interface GetBarbersResponse {
    barbers: User[];
}

export const barbersApi = createApi({
    baseQuery: fetchBase,
    reducerPath: 'barbersApi',
    endpoints: builder => ({
        getBarbers: builder.query<GetBarbersResponse, void>({
            query() {
                return {
                    url: `/barbers`,
                };
            },
        }),
    }),
});

export const {
    useGetBarbersQuery,
} = barbersApi;
