import * as React from 'react'
import { useAppDispatch } from '../../app/hooks'
import { Emoji, EmojiRendered, IPost, reactionAdded } from './postsSlice'

const renderedEmoji: EmojiRendered = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
}

interface ReactionButtonsProps {
  post: IPost
}

const ReactionButton: React.FC<ReactionButtonsProps> = ({ post }) => {
  const dispatch = useAppDispatch()

  const onEmojiClicked = (postId: string, emoji: Emoji): void => {
    dispatch(
      reactionAdded({
        postId,
        emoji,
      }),
    )
  }

  const reactionButtons = Object.entries(renderedEmoji).map(
    ([emoji, renderedEmoji]) => {
      const currentEmojy = emoji as Emoji
      const currentEmojiAmount = post.reactions[currentEmojy]

      return (
        <button
          key={emoji}
          type="button"
          className="muted-button reaction-button"
          onClick={() => onEmojiClicked(post.id, currentEmojy)}
        >
          {renderedEmoji} {currentEmojiAmount}
        </button>
      )
    },
  )

  return <div>{reactionButtons}</div>
}

export default ReactionButton
