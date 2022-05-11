import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction,
} from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { RootState } from '../../app/store'

export type Emoji = 'thumbsUp' | 'hooray' | 'heart' | 'rocket' | 'eyes'
export type EmojiCount = Record<Emoji, number>
export type EmojiRendered = Record<Emoji, string>
export type EmojiToAdd = {
  postId: string
  emoji: Emoji
}

export interface IApiPost {
  title: string
  content: string
  user: string
}

export interface IPost {
  id: string
  title: string
  date: string
  content: string
  user: string
  reactions: EmojiCount
}

export interface PostsState {
  posts: Array<IPost>
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

export const initialEmoji: EmojiCount = {
  thumbsUp: 0,
  hooray: 0,
  heart: 0,
  rocket: 0,
  eyes: 0,
}

const initialState: PostsState = {
  posts: [],
  status: 'idle',
  error: null,
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data as IPost[]
})

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (initialPost: IApiPost) => {
    const response = await client.post('/fakeApi/posts', initialPost)
    return response.data as IPost
  },
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      // Use the PayloadAction type to declare the contents of `action.payload`
      reducer(state, action: PayloadAction<IPost>) {
        state.posts.push(action.payload)
      },
      prepare(title: string, content: string, userId: string) {
        return {
          payload: {
            id: nanoid(),
            title,
            date: new Date().toISOString(),
            content,
            user: userId,
            reactions: initialEmoji,
          },
        }
      },
    },
    postUpdated(state, action: PayloadAction<IPost>) {
      const { id, title, content } = action.payload
      const existingPost = state.posts.find(post => post.id === id)
      if (existingPost) {
        existingPost.id = id
        existingPost.title = title
        existingPost.content = content
      }
    },
    reactionAdded(state, action: PayloadAction<EmojiToAdd>) {
      const { postId, emoji } = action.payload
      const existingPost = state.posts.find(post => post.id === postId)
      if (existingPost) {
        existingPost.reactions[emoji]++
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, _) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.posts = state.posts.concat(action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? null
      })
    builder.addCase(addNewPost.fulfilled, (state, action) => {
      state.posts.push(action.payload)
    })
  },
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export const selectAllPosts = (state: RootState) => state.posts.posts
export const selectPostById = (state: RootState, id: string) =>
  state.posts.posts.find(post => post.id === id)
export const selectPostStatus = (state: RootState) => state.posts.status
export const selectError = (state: RootState) => state.posts.error

export default postsSlice.reducer
