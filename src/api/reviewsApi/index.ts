import {createApi} from '@reduxjs/toolkit/query/react';
import fetchBase from '../fetchBase';

interface GetReviewsResponse {
  data: any[];
  metadata: {total: number; page: number; totalPages: number};
}

interface GetReviewsRequest {
  barber: string;
  page: number;
}

interface CreateReviewsRequest {
  barber: number;
  score: number;
  comment: string;
}

interface CreateReviewsReponse {
  barber: number;
  score: number;
  comment: string;
  user: number;
}

export const reviewsApi = createApi({
  baseQuery: fetchBase,
  reducerPath: 'reviewsApi',
  endpoints: builder => ({
    getReviews: builder.query<GetReviewsResponse, GetReviewsRequest>({
      query(args) {
        return {
          url: `/reviews`,
          params: {
            barber: args.barber,
            page: args.page,
          },
        };
      },
    }),
    createReview: builder.mutation<CreateReviewsReponse, CreateReviewsRequest>({
      query(args) {
        return {
          url: `/reviews/create/`,
          body: args,
          method: 'POST',
        };
      },
    }),
  }),
});

export const {useGetReviewsQuery, useCreateReviewMutation} = reviewsApi;
