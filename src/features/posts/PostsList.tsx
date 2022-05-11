import * as React from 'react'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import Spinner from '../../components/Spinner'
import PostExcerpt from './PostExcerpt'
import {
  fetchPosts,
  selectError,
  selectPostIds,
  selectPostStatus,
} from './postsSlice'

interface PostsListProps {}

const PostsList: React.FC<PostsListProps> = () => {
  const dispatch = useAppDispatch()

  const orderedPostIds = useAppSelector(selectPostIds)
  const postStatus = useAppSelector(selectPostStatus)
  const error = useAppSelector(selectError)

  React.useEffect(() => {
    if (postStatus !== 'idle') return
    dispatch(fetchPosts())
  }, [dispatch, postStatus])

  let content

  if (postStatus === 'loading') content = <Spinner text="Loading..." />
  if (postStatus === 'failed') content = <div>{error}</div>
  if (postStatus === 'succeeded') {
    content = orderedPostIds.map(postId => (
      <PostExcerpt key={postId} postId={postId} />
    ))
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}

export default PostsList
