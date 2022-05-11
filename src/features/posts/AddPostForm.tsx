import * as React from 'react'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectAllUsers, Status } from '../users/usersSlice'
import { addNewPost } from './postsSlice'

const AddPostForm = () => {
  const [title, setTitle] = React.useState<string>('')
  const [content, setContent] = React.useState<string>('')
  const [userId, setUserId] = React.useState<string>('')
  const [addRequestStatus, setAddRequestStatus] = React.useState<Status>('idle')

  const dispatch = useAppDispatch()

  const users = useAppSelector(selectAllUsers)

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setTitle(e.target.value)

  const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>): void =>
    setContent(e.target.value)

  const onAuthorChanged = (e: React.ChangeEvent<HTMLSelectElement>): void =>
    setUserId(e.target.value)

  const canSave =
    [title, content, userId].every(Boolean) && addRequestStatus === 'idle'

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('loading')
        await dispatch(addNewPost({ title, content, user: userId })).unwrap()
        setAddRequestStatus('succeeded')
        setTitle('')
        setContent('')
        setUserId('')
      } catch (error) {
        console.error('Failed to save the post: ', error)
      } finally {
        setAddRequestStatus('idle')
      }
    }
  }

  const usersOptions = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  )
}

export default AddPostForm
