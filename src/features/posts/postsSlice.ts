import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { sub } from 'date-fns'

export type Emoji = 'thumbsUp' | 'hooray' | 'heart' | 'rocket' | 'eyes'
export type EmojiCount = Record<Emoji, number>
export type EmojiRendered = Record<Emoji, string>
export type EmojiToAdd = {
  postId: string
  emoji: Emoji
}

export interface IPost {
  id: string
  title: string
  date: string
  content: string
  user: string
  reactions: EmojiCount
}

export type PostsState = Array<IPost>

export const initialEmoji: EmojiCount = {
  thumbsUp: 0,
  hooray: 0,
  heart: 0,
  rocket: 0,
  eyes: 0,
}

const initialState: PostsState = [
  {
    id: '1',
    title: 'First Post!',
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    content: 'Hello!',
    user: '1',
    reactions: initialEmoji,
  },
  {
    id: '2',
    title: 'Second Post',
    date: sub(new Date(), { minutes: 5 }).toISOString(),
    content: 'More text',
    user: '2',
    reactions: initialEmoji,
  },
]

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      // Use the PayloadAction type to declare the contents of `action.payload`
      reducer(state, action: PayloadAction<IPost>) {
        state.push(action.payload)
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
      const existingPost = state.find(post => post.id === id)
      if (existingPost) {
        existingPost.id = id
        existingPost.title = title
        existingPost.content = content
      }
    },
    reactionAdded(state, action: PayloadAction<EmojiToAdd>) {
      const { postId, emoji } = action.payload
      const existingPost = state.find(post => post.id === postId)
      if (existingPost) {
        existingPost.reactions[emoji]++
      }
    },
  },
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer
