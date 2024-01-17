import {createApi} from '@reduxjs/toolkit/query/react';
import fetchBase from '../fetchBase';

interface GetReviewsResponse {
  data: any[];
  metadata: {total: number; page: number; totalPages: number};
}

interface GetImagesResponse {
  data: any[];
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

export const galleryApi = createApi({
  baseQuery: fetchBase,
  reducerPath: 'galleryApi',
  endpoints: builder => ({
    getImages: builder.query<GetImagesResponse, any>({
      query() {
        return {
          url: `/gallery`,
        };
      },
    }),
    getImagesFromBarber: builder.query<GetImagesResponse, any>({
      query(args) {
        return {
          url: `/gallery/images-from-barber`,
          params:{barber:args.id}
        };
      },
    }),
    createImage: builder.mutation<GetImagesResponse, any>({
      query(args) {
        return {
          url: `/gallery/create`,
          method: 'POST',
          body: args,
          formData: true,
        };
      },
    }),
    deleteImage: builder.mutation<GetImagesResponse, any>({
      query(args) {
        return {
          url: `/gallery/delete/${args.id}`,
          method: 'DELETE',
          body: {imageForDeletion: args.publicId},
        };
      },
    }),
  }),
});

export const {
  useGetImagesQuery,
  useGetImagesFromBarberQuery,
  useCreateImageMutation,
  useDeleteImageMutation,
} = galleryApi;
