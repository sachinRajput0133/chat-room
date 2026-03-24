import { baseApi } from './baseApi';
import { Room, CreateRoomRequest } from '../../types/room.types';

export const roomsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRooms: builder.query<Room[], void>({
      query: () => '/rooms',
      providesTags: ['Rooms'],
    }),
    createRoom: builder.mutation<Room, CreateRoomRequest>({
      query: (body) => ({
        url: '/rooms',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Rooms'],
    }),
    joinRoom: builder.mutation<Room, string>({
      query: (roomId) => ({
        url: `/rooms/${roomId}/join`,
        method: 'POST',
      }),
      invalidatesTags: ['Rooms'],
    }),
  }),
});

export const { useGetRoomsQuery, useCreateRoomMutation, useJoinRoomMutation } = roomsApi;
