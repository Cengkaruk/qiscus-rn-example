import React from 'react'
import I18n from 'react-native-i18n'
import {
  View,
  ToastAndroid,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  BackHandler,
  Clipboard
} from 'react-native'
import moment from 'moment'
import { Actions } from 'react-native-router-flux'

import { Images, Dictionary, Colors } from '../Themes'

/**
 * import component
 */
import { Header, EmptyState, ListChat } from '../Components'

import styles from './Styles/ChatListStyles'

I18n.translations = Dictionary

class ChatList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      data: [],
      id: this.props.id,
      name: this.props.roomName,
      email: this.props.email,
      type: this.props.typeRoom,
      lastMessageDate: '',
      message: '',
      photo: Images.profile,
      messageOption: false,
      lastCommentId: -1,
      firstCommentId: -1,
      loadmore: true,
      callback: this.props.callback,
      isActive: true,
      idReply: -1, // id comment that will be replied
      nameUserReplied: '', // name of user replied
      emailUserReplied: '', // email of user replied
      messageReply: '', // message comment that appear before replied
      isReplying: false,
      comments: this.props.comments
    } 
  }

  emitter = this.props.EventEmitter // receiving props emitter from ChatRoom.js (romm list)

  /**
   * array chat is reversed, and flatlist will show it in reversed too
   * this is to make the flatlist auto scroll to bottom 
   * and if new (previeous) data added (older message), it wont move the index data in array
   * so the scroll view in flatlist wont move because new data added
   */

  loadRoom () {
    ToastAndroid.show('new message', ToastAndroid.SHORT)
  }

  componentWillMount () {
    // add event emitter for handling new message
    this.emitter.addListener('new message', (params) => this.newMessage(params))

    qiscus = this.props.qiscus
    qiscus.getRoomById(this.props.id).then(data => {
      try {
        const reversedData = data.comments.length > 0 ? [...data.comments].reverse() : []
        this.setState({
          data: reversedData,
          loading: false,
          lastMessageDate: reversedData[0].timestamp,
          type: this.props.typeRoom,
          photo: data.avatar,
          lastCommentId: reversedData[reversedData.length - 1].id,
          firstCommentId: reversedData[0].id
        })
      } catch (e) {
        this.setState({
          data: [],
          loading: false,
          type: this.props.typeRoom,
          photo: data.avatar
        })
      }
    }, err => {
      ToastAndroid.show(err, ToastAndroid.SHORT)
    })
  }

  componentDidMount () {
    BackHandler.addEventListener('hardwareBackPress', () => this.backAndroid())
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', () => this.backAndroid())
  }

  backAndroid () {
    this.setState({
      isActive: false
    })
    Actions.pop({ refresh: { callback: !this.state.callback } })
    return true
  }

  newMessage (data) {
    if (this.state.isActive) {
      if (data.room_id_str === this.state.id) {
        const temp = {
        "attachment": null,
        "avatar": data.user_avatar,
        "before_id": data.comment_before_id,
        "date": data.timestamp,
        "id": data.id,
        "isDelivered": false,
        "isFailed": false,
        "isPending": false,
        "isRead": false,
        "isSent": false,
        "is_deleted": false,
        "message": data.message,
        "payload": data.payload,
        "status": "read",
        "subtype": null,
        "time": moment(data.timestamp).format('HH:mm A'),
        "timestamp": data.timestamp,
        "type": "text",
        "unique_id": data.unique_temp_id,
        "username_as": data.username,
        "username_real": data.email
      }
      let tempData = [...this.state.data]
      tempData.unshift(temp)
      this.setState({
        data: tempData ,
        lastMessageDate: moment(data.timestamp).format('YYYY-MM-DD')
      })
      }
    }
  }

  /**
   * to view date when last message received
   */
  renderDate () {
    return (
      <View style={styles.dateContainer}>
        <View style={styles.date}>
          <Text style={styles.textDate}>
            {String(moment(this.state.lastMessageDate).format('dddd, MMMM DD, YYYY').toUpperCase())}
          </Text>
        </View>
      </View>
    )
  }

  profile () {
    ToastAndroid.show('right pressed', ToastAndroid.SHORT)
  }

  renderList () {
    return (
      <FlatList
        ref={ref => this.scrollView = ref}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 8, paddingBottom: 12 }}
        data={this.state.data}
        renderItem={this.renderitem}
        keyExtractor={item => item.id}
        inverted // to show data from last index -> first index
        onEndReached={this.loadmore.bind(this)}
        onEndReachedThreshold={0.1}
        keyboardShouldPersistTaps='always'
        showsVerticalScrollIndicator={false}
      />
    )
  }

  renderitem = ({ item, index }) => {
    const { data } = this.state
    let isFirst
    if (index === data.length - 1) {
      isFirst = true
    } else if (data[index].username_real === data[index + 1].username_real) {
      isFirst = false
    } else {
      isFirst = true
    }
    return (
      <ListChat
        email={this.state.email}
        emailSender={item.username_real}
        type={this.state.type}
        message={item.message}
        time={item.time}
        isFirst={isFirst}
        name={item.username_as}
        photo={item.avatar}
        payload={item.payload}
        isDelivered={item.isDelivered}
        isFailed={item.isFailed}
        isPending={item.isPending}
        isRead={item.isRead}
        isSent={item.isSent}
        onLongPress={() =>
          {
            const tempMessage = item.payload !== null ? item.payload.text : item.message
            this.setState({
              messageOption: true,
              idReply: item.id,
              emailUserReplied: item.username_real,
              nameUserReplied: item.username_as,
              messageReply: tempMessage
            })
          }
        }
      />
    )
  }

  renderInput () {
    const { message, isReplying } = this.state
    let showReplied = isReplying ? this.renderReply() : null
    return (
      <View style={{ flexDirection: 'column' }}>
        {showReplied}
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => {}}
            >
              <Image source={Images.attach} style={styles.imageButton} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 8 }}>
              <TextInput
                placeholder={I18n.t('placeholdermessage')}
                underlineColorAndroid='transparent'
                style={styles.input}
                value={message}
                onChangeText={(text) => {
                  if (text.length > 0) { qiscus.publishTyping(1) }
                  this.setState({ message: text })}
                }
                autoCapitalize='none'
                autoCorrect={false}
                multiline
              />
            </View>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => this.sendMessage()}
            >
              <Image source={Images.send} style={styles.imageButton} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  renderReply () {
    const { nameUserReplied, messageReply } = this.state
    let messagePreview
    if (messageReply.length < 50) {
      messagePreview = messageReply.replace(/\n/g, ' ')
    } else {
      messagePreview = messageReply.replace(/\n/g, ' ')
      messagePreview = messagePreview.substr(0, 49) + '...'
    }
    return (
      <View style={styles.replyContainer}>
        <View style={{ flexDirection: 'column' }}>
          <View style={styles.greenBar} />
        </View>
        <View style={styles.contentReplyContainer}>
          <Text style={styles.textName}>{nameUserReplied}</Text>
          <Text style={styles.textMessage}>{messagePreview}</Text>
        </View>
        <View style={{ flex: 1 }} />
        <View style={styles.cancelContainer}>
          <TouchableOpacity
            onPress={() => this.setState({ isReplying: false })}
            style={{ padding: 8, marginRight: 4 }}
          >
            <Image source={Images.cancelGrey} style={styles.cancel} />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
        </View>
      </View>
    )
  }

  renderModalOptionMessage () {
    const { messageOption } = this.state
    return (
      <Modal
        animationType={'fade'}
        transparent
        visible={messageOption}
        onRequestClose={() => this.setState({ messageOption: false })}
      >
        <TouchableWithoutFeedback onPress={() => this.setState({ messageOption: false })}>
          <View style={styles.modalContainer}>
            <View style={{ flex: 1 }} />
            <View style={styles.optionContainer}>
              {this.renderMenu(Images.reply, I18n.t('reply'))}
              {this.renderMenu(Images.forward, I18n.t('forward'))}
              {this.renderMenu(Images.copy, I18n.t('copy'))}
              <View style={styles.border} />
              {this.renderMenu(Images.cancel, I18n.t('cancel'))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  renderMenu (images, label) {
    const newStyle = label === I18n.t('cancel') ? { color: Colors.red } : {}
    return (
      <TouchableOpacity
        style={styles.menuContainer}
        onPress={() => this.menuHandler(label)}
      >
        <Image source={images} style={styles.iconMenu} />
        <Text style={[styles.textMenu, newStyle]}>{label}</Text>
      </TouchableOpacity>
    )
  }

  async menuHandler (label) {
    switch (label) {
      case I18n.t('reply'):
        this.setState({ messageOption: false, isReplying: true })
        break;
      case I18n.t('copy'):
        await Clipboard.setString(this.state.messageReply)
        this.setState({ messageOption: false })
        ToastAndroid.show(I18n.t('messageCopied'), ToastAndroid.SHORT)
      default:
        break;
    }
  }

  loadmore () {
    const { loadmore } = this.state
    if (loadmore) {
      options = {
        limit: 10
      }
      qiscus.loadMore(this.state.lastCommentId, options = {})
        .then(res => {
          if (res.length > 0) {
            const reversedData = res.length > 0 ? res.reverse() : []
            let tempData = this.state.data.concat(reversedData)
            this.setState({
              data: tempData,
              lastMessageDate: reversedData[0].timestamp,
              lastCommentId: reversedData[reversedData.length - 1].id
            })
          } else {
            this.setState({
              loadmore: false
            })
          }
        }, err => {
          throw new Error(err)
        })
    }
  }

  sendMessage () {
    const { id, message, firstCommentId, isReplying, nameUserReplied, emailUserReplied, messageReply, idReply } = this.state
    if (message.length > 0) {
      if (isReplying) {
        const payload = {
          text: message,
          replied_comment_id: idReply,
          replied_comment_message: messageReply,
          replied_comment_payload: null,
          replied_comment_sender_email: emailUserReplied,
          replied_comment_sender_username: nameUserReplied,
          replied_comment_type: 'text'
        }
        qiscus.sendComment(id, message, null, 'reply', JSON.stringify(payload))
          .then(() => {
            this.setState({ message: '', isReplying: false })
            qiscus.publishTyping(0)
          })
      } else {
        qiscus.sendComment(id, message)
        .then(() => {
          this.setState({ message: '', isReplying: false })
          qiscus.publishTyping(0)
        })
      }
    }
  }

  render () {
    const { data, loading, photo } = this.state
    let view, renderDate, renderInput
    if (loading) {
      view = (
        <View />
      )
    } else {
      view = data.length > 0 ? this.renderList() : <EmptyState type='chat' />
      renderDate = data.length > 0 ? this.renderDate() : null
      renderInput = this.renderInput()
    }
    return (
      <View style={styles.container}>
        <Header
          title={this.state.name}
          onLeftPress={() => this.backAndroid()}
          showRightButton
          isLoading={loading}
          rightButtonImage={photo}
          onRightPress={() => this.profile()}
        />
        {renderDate}
        {view}
        {renderInput}
        {this.renderModalOptionMessage()}
      </View>
    )
  }
}

export default ChatList
