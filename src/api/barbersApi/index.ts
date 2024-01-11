import { createApi } from '@reduxjs/toolkit/query/react';
import fetchBase from '../fetchBase';
import { User } from '../../types/user';

interface GetBarbersResponse {
    barbers: User[];
}

interface GetBarberDetailResponse {
    barber: User[];
}

interface GetBarberDetailRequest {
    id: string
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

        getBarberDetail: builder.query<GetBarberDetailResponse, GetBarberDetailRequest>({
            query(args) {
                return {
                    url: `/barbers/${args.id}`,
                };
            },
        }),
    }),


});

export const {
    useGetBarbersQuery,
    useGetBarberDetailQuery
} = barbersApi;
