import { baseApi } from './baseApi';
import { Message } from '../../types/message.types';

export const messagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query<Message[], string>({
      query: (roomId) => `/rooms/${roomId}/messages`,
      providesTags: (_result, _error, roomId) => [{ type: 'Messages', id: roomId }],
      // Keep sidebar previews fresh — poll every 30s for rooms not actively open
      keepUnusedDataFor: 60,
    }),
  }),
});

export const { useGetMessagesQuery } = messagesApi;
