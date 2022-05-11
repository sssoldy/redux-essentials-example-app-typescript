import * as React from 'react'
import { useAppSelector } from '../../app/hooks'
import { selectUserById } from '../users/usersSlice'

interface PostAuthorProps {
  userId: string
}

const PostAuthor: React.FC<PostAuthorProps> = ({ userId }) => {
  const author = useAppSelector(state => selectUserById(state, userId))

  return <span>by {author ? author.name : 'Unknown author'}</span>
}

export default PostAuthor
