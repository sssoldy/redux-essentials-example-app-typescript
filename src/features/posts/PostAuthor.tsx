import * as React from 'react'
import { useAppSelector } from '../../app/hooks'

interface PostAuthorProps {
  userId: string | undefined
}

const PostAuthor: React.FC<PostAuthorProps> = ({ userId }) => {
  const author = useAppSelector(state =>
    state.users.find(user => user.id === userId),
  )

  return <span>by {author ? author.name : 'Unknown author'}</span>
}

export default PostAuthor
