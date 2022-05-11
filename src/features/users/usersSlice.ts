import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { RootState } from '../../app/store'

export interface IUser {
  id: string
  name: string
}

export type Status = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface UsersState {
  status: Status
  error: string | null
}

const usersAdapter = createEntityAdapter<IUser>({
  selectId: user => user.id,
})

const initialState = usersAdapter.getInitialState<UsersState>({
  status: 'idle',
  error: null,
})

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
      usersAdapter.setAll(state, action.payload)
      state.status = 'succeeded'
    })
  },
})

export default usersSlice.reducer

export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors((state: RootState) => state.users)
