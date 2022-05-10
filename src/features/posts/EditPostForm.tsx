import * as React from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { postUpdated } from './postsSlice'

interface MatchParams {
  postId: string
}

interface EditPostFormProps extends RouteComponentProps<MatchParams> {}

const EditPostForm: React.FC<EditPostFormProps> = ({ match }) => {
  const { postId } = match.params
  const post = useAppSelector(state =>
    state.posts.find(post => post.id === postId),
  )

  const [title, setTitle] = React.useState(post?.title)
  const [content, setContent] = React.useState(post?.content)
  const [userId] = React.useState(post?.id)

  const dispatch = useAppDispatch()
  const history = useHistory()

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setTitle(e.target.value)

  const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>): void =>
    setContent(e.target.value)

  const onSavePostClicked = (): void => {
    const date = post?.date
    if (!title || !content || !userId || !date) return

    dispatch(
      postUpdated({
        id: postId,
        title,
        content,
        user: userId,
        date,
        reactions: { thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0 },
      }),
    )

    history.push(`posts/${postId}`)
  }

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
      </form>
      <button type="button" onClick={onSavePostClicked}>
        Save Post
      </button>
    </section>
  )
}

export default EditPostForm
