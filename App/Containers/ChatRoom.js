import React from 'react'
import I18n from 'react-native-i18n'
import {
  View,
  ToastAndroid,
  Text,
  FlatList,
  TouchableOpacity,
  Image
} from 'react-native'
import moment from 'moment'
import { Actions, ActionConst } from 'react-native-router-flux'
import qiscus from '../../libs/SDKCore'

import { Images, Dictionary, Colors } from '../Themes'

/**
 * import component
 */
import { Header, EmptyState, ListRoom } from '../Components'

import styles from './Styles/ChatRoomStyles'

/**
 * add event emitter for handling new message
 */

import EventEmitter from 'EventEmitter'
const emitter = new EventEmitter()

I18n.locale = 'en'
I18n.translations = Dictionary

class ChatRoom extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      data: [],
      email: this.props.email, // receiving params from previous container
      photo: this.props.photo,
      isComponentActive: true,
    }
  }

  componentWillMount () {
    this.init()
    this.loadRoom()
  }

  init () {
    qiscus.init({
      AppId: 'sampleapp-65ghcsaysse',
      options: {
        newMessagesCallback: (comments) => {
          this.loadRoom()
          emitter.emit('new message', comments[0]) // emitter name is new message
        },
        chatRoomCreatedCallback: (data) => {
          this.loadRoom()
        },
        typingCallback: (data) => {
          emitter.emit('typing', data)
        },
        presenceCallback: (data) => {
          emitter.emit('status', data)
        },
        commentDeliveredCallback: (data) => {
          // emitter.emit('delivered', data)
        },
        commentReadCallback: (data) => {
          this.loadRoom()
          emitter.emit('read', data)
        }
      }
    })
  }

  loadRoom () {
    qiscus.userAdapter.loadRoomList().then(data =>
      this.setState({
        data: data,
        loading: false
      }))
  }

  profile () {
    let data = qiscus.userData
    Actions.profile({
      type: ActionConst.PUSH,
      typeProfile: 'self',
      qiscus: this.qiscus,
      data: data,
      emitter: emitter
    })
  }

  openContact () {
    Actions.contact({
      type: ActionConst.PUSH,
      qiscus: this.qiscus,
      emitter: emitter
    })
  }

  renderList () {
    return (
      <FlatList
        data={this.state.data}
        renderItem={this.renderitem}
        keyExtractor={item => item.id}
      />
    )
  }

  renderitem = ({ item }) => {
    let date, lastMessage
    const tempDay = 24 * 60 * 60 * 1000
    if ((moment() - item.last_comment.unix_timestamp * 1000) < tempDay) {
      date = moment(item.last_comment.unix_timestamp * 1000).format('hh:mm')
    } else {
      date = moment(item.last_comment.unix_timestamp * 1000).format('DD/MM/YY')
    }
    lastMessage = item.last_comment.message.replace(/\n/g, ' ')
    if (lastMessage.length > 50) {
      lastMessage = lastMessage.substr(0, 48) + '...'
    }
    return (
      <ListRoom
        unreadCount={item.unread_count}
        avatar={item.avatar_url}
        name={item.room_name}
        lastMessage={lastMessage}
        date={date}
        onPress={() => this.detailChat(item.id_str, item.room_name, item.chat_type)}
      />
    )
  }

  detailChat (id, name, typeRoom) {
    this.setState({
      isComponentActive: false
    })
    Actions.chatlist({
      type: ActionConst.PUSH,
      id: id,
      roomName: name,
      email: this.state.email,
      typeRoom: typeRoom,
      qiscus: qiscus,
      emitter: emitter // proping emitter for chat list component
    })
  }

  render () {
    const { data, loading, photo } = this.state
    let view
    if (loading) {
      view = (
        <View />
      )
    } else {
      view = data.length > 0 ? this.renderList() :
        <EmptyState
          type='room'
          showButton
          qiscus={qiscus}
          emitter={emitter}
        />
    }
    return (
      <View style={styles.container}>
        <Header
          title={I18n.t('conversations')}
          leftButtonImage={photo}
          onLeftPress={() => this.profile()}
          showRightButton
          isLoading={loading}
          rightButtonImage={Images.search}
          onRightPress={() => this.openContact()}
        />
        {view}
      </View>
    )
  }
}

export default ChatRoom
