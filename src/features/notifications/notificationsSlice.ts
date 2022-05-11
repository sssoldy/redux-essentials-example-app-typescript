import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { RootState } from '../../app/store'

export const fetchNotifications = createAsyncThunk<
  Notification[],
  void,
  { state: RootState }
>('notifications/fetchNotifications', async (_, { getState }) => {
  const allNotifications = selectAllNotifications(getState())
  const [latestNotification] = allNotifications
  const latestTimestamp = latestNotification ? latestNotification.date : ''
  const response = await client.get(
    `/fakeApi/notifications?since=${latestTimestamp}`,
  )
  return response.data as Notification[]
})

export interface Notification {
  id: string
  date: string
  message: string
  user: string
  read: boolean
  isNew: boolean
}

export interface NotificationState {}

const notificationsAdapter = createEntityAdapter<Notification>({
  selectId: n => n.id,
})

const initialState = notificationsAdapter.getInitialState<NotificationState>({})

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationsRead(state) {
      Object.values(state.entities).forEach(notification => {
        if (notification) notification.read = true
      })
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      notificationsAdapter.upsertMany(state, action.payload)
      Object.values(state.entities).forEach(notification => {
        if (notification) notification.isNew = !notification.read
      })
    })
  },
})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const { selectAll: selectAllNotifications } =
  notificationsAdapter.getSelectors((state: RootState) => state.notifications)
