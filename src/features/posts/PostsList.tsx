import * as React from 'react'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import Spinner from '../../components/Spinner'
import PostExcerpt from './PostExcerpt'
import {
  fetchPosts,
  selectAllPosts,
  selectError,
  selectPostStatus,
} from './postsSlice'

interface PostsListProps {}

const PostsList: React.FC<PostsListProps> = () => {
  const dispatch = useAppDispatch()

  const posts = useAppSelector(selectAllPosts)
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
    // Sort posts in reverse chronological order by datetime string
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))

    content = orderedPosts.map(post => (
      <PostExcerpt key={post.id} post={post} />
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
