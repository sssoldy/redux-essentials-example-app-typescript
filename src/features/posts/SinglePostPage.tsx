import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import PostAuthor from './PostAuthor'
import ReactionButton from './ReactionButtons'
import TimeAgo from './TimeAgo'

interface MatchParams {
  postId: string
}

interface SinglePostProps extends RouteComponentProps<MatchParams> {}

const SinglePostPage: React.FC<SinglePostProps> = ({ match }) => {
  const { postId } = match.params

  const post = useAppSelector(state =>
    state.posts.find(post => post.id === postId),
  )

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <div>
          <PostAuthor userId={post.user} />
          <TimeAgo timestamp={post.date} />
        </div>
        <p className="post-content">{post.content}</p>
        <ReactionButton post={post} />
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
      </article>
    </section>
  )
}

export default SinglePostPage
