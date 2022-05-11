import * as React from 'react'
import { formatDistanceToNow, parseISO } from 'date-fns'

import {
  allNotificationsRead,
  selectAllNotifications,
} from './notificationsSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectAllUsers } from '../users/usersSlice'
import classNames from 'classnames'

const NotificationsList: React.FC = () => {
  const dispatch = useAppDispatch()
  const notifications = useAppSelector(selectAllNotifications)
  const users = useAppSelector(selectAllUsers)

  React.useLayoutEffect(() => {
    dispatch(allNotificationsRead())
  })

  const renderedNotifications = notifications.map(notification => {
    const date = parseISO(notification.date)
    const timeAgo = formatDistanceToNow(date)
    const user = users.find(user => user.id === notification.user) || {
      name: 'Unknown User',
    }

    const notificationClassName = classNames('notification', {
      new: notification.isNew,
    })

    return (
      <div key={notification.id} className={notificationClassName}>
        <div>
          <b>{user.name}</b> {notification.message}
        </div>
        <div title={notification.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    )
  })

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}

export default NotificationsList
