import { createSlice } from '@reduxjs/toolkit'

export interface IUser {
  id: string
  name: string
}

export type UsersState = Array<IUser>

const initialState: UsersState = [
  { id: '0', name: 'Tianna Jenkins' },
  { id: '1', name: 'Kevin Grant' },
  { id: '2', name: 'Madison Price' },
]

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
})

export default usersSlice.reducer
