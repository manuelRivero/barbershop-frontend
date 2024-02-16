import { createApi } from '@reduxjs/toolkit/query/react';
import fetchBase from '../fetchBase';
import { User } from '../../types/user';

interface GetBarberRequest {
    isAdmin?: boolean
}

interface GetBarbersResponse {
    barbers: User[];
}

interface GetBarberDetailResponse {
    barber: User[];
}

interface GetBarberDetailRequest {
    id: string
}

interface DisableRequest {
    barber: string,
}

export const barbersApi = createApi({
    baseQuery: fetchBase,
    reducerPath: 'barbersApi',
    endpoints: builder => ({
        getBarbers: builder.query<GetBarbersResponse, GetBarberRequest>({
            query(args) {
                return {
                    url: `/barbers`,
                    params: {
                        isAdmin: args.isAdmin || false
                    }
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
        barberDisable: builder.mutation<any, DisableRequest>({
            query(args) {
                return {
                    url: `barbers/disable`,
                    method: "post",
                    body: {
                        barber: args.barber,
                    }
                };
            },
        }),
    }),


});

export const {
    useGetBarbersQuery,
    useGetBarberDetailQuery,
    useBarberDisableMutation
} = barbersApi;
