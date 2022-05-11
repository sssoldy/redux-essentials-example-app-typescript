import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
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

const postsAdapter = createEntityAdapter<IPost>({
  selectId: post => post.id,
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

const initialState = postsAdapter.getInitialState<PostsState>({
  status: 'idle',
  error: null,
})

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
        postsAdapter.addOne(state, action.payload)
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
      // const existingPost = state.posts.find(post => post.id === id)
      const existingPost = state.entities[id]
      if (existingPost) {
        existingPost.id = id
        existingPost.title = title
        existingPost.content = content
      }
    },
    reactionAdded(state, action: PayloadAction<EmojiToAdd>) {
      const { postId, emoji } = action.payload
      // const existingPost = state.posts.find(post => post.id === postId)
      const existingPost = state.entities[postId]
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
        postsAdapter.upsertMany(state, action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? null
      })
    builder.addCase(addNewPost.fulfilled, postsAdapter.addOne)
  },
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state: RootState) => state.posts)

export const selectPostsByUser = createSelector(
  [selectAllPosts, (_, userId: string) => userId],
  (posts, userId) => posts.filter(post => post.user === userId),
)

export const selectPostStatus = (state: RootState) => state.posts.status

export const selectError = (state: RootState) => state.posts.error
