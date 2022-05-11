import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { RootState } from '../../app/store'

export interface IUser {
  id: string
  name: string
}

export type Status = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface UsersState {
  users: Array<IUser>
  status: Status
  error: string | null
}

const initialState: UsersState = {
  users: [],
  status: 'idle',
  error: null,
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get('/fakeApi/users')
  return response.data as IUser[]
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.users = action.payload
    })
  },
})

export const selectAllUsers = (state: RootState) => state.users.users

export const selectUserById = (state: RootState, id: string) =>
  state.users.users.find(user => user.id === id)

export default usersSlice.reducer
