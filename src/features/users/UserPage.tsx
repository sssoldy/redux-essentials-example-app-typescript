import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { selectPostsByUser } from '../posts/postsSlice'
import { selectUserById } from './usersSlice'

interface MatchParams {
  userId: string
}

interface UserPageProps extends RouteComponentProps<MatchParams> {}

const UserPage: React.FC<UserPageProps> = ({ match }) => {
  const { userId } = match.params

  const user = useAppSelector(state => selectUserById(state, userId)) || {
    name: 'Unknown User',
  }

  const postsForUser = useAppSelector(state => selectPostsByUser(state, userId))

  const postTitles = postsForUser.map(post => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user.name}</h2>

      <ul>{postTitles}</ul>
    </section>
  )
}

export default UserPage
