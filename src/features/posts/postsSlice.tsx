import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IPost {
  id: string
  title: string
  content: string
}

export type PostsState = Array<IPost>

const initialState: PostsState = [
  { id: '1', title: 'First Post!', content: 'Hello!' },
  { id: '2', title: 'Second Post', content: 'More text' },
]

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    postAdded(state, action: PayloadAction<IPost>) {
      state.push(action.payload)
    },
  },
})

export const { postAdded } = postsSlice.actions

export default postsSlice.reducer
