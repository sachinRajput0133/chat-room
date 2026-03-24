import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RoomsState {
  activeRoomId: string | null;
  searchQuery: string;
}

const initialState: RoomsState = {
  activeRoomId: null,
  searchQuery: '',
};

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setActiveRoom(state, action: PayloadAction<string | null>) {
      state.activeRoomId = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
  },
});

export const { setActiveRoom, setSearchQuery } = roomsSlice.actions;
export default roomsSlice.reducer;
