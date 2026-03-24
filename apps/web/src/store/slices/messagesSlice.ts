import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '../../types/message.types';

interface MessagesState {
  byRoom: Record<string, Message[]>;
  unreadCounts: Record<string, number>;
}

const initialState: MessagesState = {
  byRoom: {},
  unreadCounts: {},
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setRoomMessages(state, action: PayloadAction<{ roomId: string; messages: Message[] }>) {
      state.byRoom[action.payload.roomId] = action.payload.messages;
    },
    addMessage(state, action: PayloadAction<Message>) {
      const { roomId } = action.payload;
      if (!state.byRoom[roomId]) {
        state.byRoom[roomId] = [];
      }
      const exists = state.byRoom[roomId].some((m) => m.id === action.payload.id);
      if (!exists) {
        state.byRoom[roomId].push(action.payload);
      }
    },
    incrementUnread(state, action: PayloadAction<string>) {
      const roomId = action.payload;
      state.unreadCounts[roomId] = (state.unreadCounts[roomId] ?? 0) + 1;
    },
    clearUnread(state, action: PayloadAction<string>) {
      state.unreadCounts[action.payload] = 0;
    },
    clearRoomMessages(state, action: PayloadAction<string>) {
      delete state.byRoom[action.payload];
    },
  },
});

export const { setRoomMessages, addMessage, incrementUnread, clearUnread, clearRoomMessages } =
  messagesSlice.actions;
export default messagesSlice.reducer;
