import {createSlice} from '@reduxjs/toolkit';

interface ProfileState {
  profileData: any;
}

const initialState: ProfileState = {
  profileData: null,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileData: (state, action) => {
      state.profileData = action?.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setProfileData} = profileSlice.actions;

export default profileSlice.reducer;
