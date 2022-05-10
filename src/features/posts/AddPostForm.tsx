import { nanoid } from '@reduxjs/toolkit'
import * as React from 'react'

import { useAppDispatch } from '../../app/hooks'
import { postAdded } from './postsSlice'

const AddPostForm = () => {
  const [title, setTitle] = React.useState<string>('')
  const [content, setContent] = React.useState<string>('')

  const dispatch = useAppDispatch()

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setTitle(e.target.value)

  const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>): void =>
    setContent(e.target.value)

  const onSavePostClicked = (): void => {
    if (!title && !content) return

    dispatch(
      postAdded({
        id: nanoid(),
        title,
        content,
      }),
    )

    setTitle('')
    setContent('')
  }

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
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked}>
          Save Post
        </button>
      </form>
    </section>
  )
}

export default AddPostForm
