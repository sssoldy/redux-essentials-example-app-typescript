import { EntityId } from '@reduxjs/toolkit'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'

import PostAuthor from './PostAuthor'
import { selectPostById } from './postsSlice'
import ReactionButton from './ReactionButtons'
import TimeAgo from './TimeAgo'

interface PostExcerptProps {
  postId: EntityId
}

const PostExcerpt: React.FC<PostExcerptProps> = ({ postId }) => {
  const post = useAppSelector(state => selectPostById(state, postId))

  return post ? (
    <article key={post.id} className="post-excerpt">
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <ReactionButton post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  ) : null
}

export default PostExcerpt
