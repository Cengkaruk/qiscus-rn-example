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
  Clipboard,
  Platform,
  Keyboard,
  KeyboardAvoidingView
} from 'react-native'
import moment from 'moment'
import { Actions, ActionConst } from 'react-native-router-flux'

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
      messageOption: false, // state modal option message
      attachment: false, // state modal attachment message
      lastCommentId: -1,
      firstCommentId: -1,
      loadmore: true,
      isActive: true,
      idReply: -1, // id comment that will be replied
      nameUserReplied: '', // name of user replied
      emailUserReplied: '', // email of user replied
      messageReply: '', // message comment that appear before replied
      isReplying: false,
      participants: [],
      uriImageReplied: '', // uri replied message with image and caption
      isTyping: false,
      isOnline: false,
      dataGroup: {
        name: '',
        photo: ''
      },
      pendingMessage: false,
      callback: true,
      lastSeen: ''
    } 
  }

  emitter = this.props.emitter // receiving props emitter from ChatRoom.js (romm list)
  qiscus = this.props.qiscus

  /**
   * array chat is reversed, and flatlist will show it in reversed too
   * this is to make the flatlist auto scroll to bottom 
   * and if new (previous) data added (older message), it wont move the index data in array
   * so the scroll view in flatlist wont move because new data added
   */

  componentWillMount () {
    // add event emitter for handling new message
    this.emitter.addListener('new message', (params) => this.newMessage(params))
    this.emitter.addListener('status', (params) => this.handleStatus(params))
    this.emitter.addListener('typing', (params) => this.handleTyping(params))
    this.emitter.addListener('read', (params) => this.handleReadMessage(params))
    this.loadRoom()
  }

  componentWillReceiveProps (nextProps) {
    const { callback, type } = this.state
    if (type === 'group') {
      if (nextProps.callback !== callback) {
        this.setState({
          callback: nextProps.callback
        })
      }
    }
  }

  loadRoom () {
    qiscus.getRoomById(this.props.id).then(data => {
      try {
        let reversedData = data.comments.length > 0 ? [...data.comments].reverse() : []
        let arrayFilter = []
        let arrayDuplicate = []
        for (let i = 0; i < reversedData.length; i++) {
          let isDuplicate = false
          for (let j = 0; j < reversedData.length; j++) {
            if (i !== j && i > j) {
              if (reversedData[i].unique_id === reversedData[j].unique_id) {
                isDuplicate = true
              }
            }
          }
          if (!isDuplicate) {
            let index = arrayDuplicate.map(function(val) { return val.unique_id; }).indexOf(reversedData[i].unique_id)
            if (index < 0) {
              arrayFilter.push(reversedData[i])
            }
          }
        }
        if (this.props.typeRoom === 'group') {
          let tempDataGroup = {
            name: this.props.roomName,
            photo: data.avatar
          }
          this.setState({
            dataGroup: tempDataGroup
          })
        }
        this.setState({
          data: arrayFilter,
          loading: false,
          lastMessageDate: arrayFilter[0].timestamp,
          type: this.props.typeRoom,
          photo: data.avatar,
          lastCommentId: arrayFilter[arrayFilter.length - 1].id,
          firstCommentId: arrayFilter[0].id,
          participants: data.participants
        })
      } catch (e) {
        this.setState({
          data: [],
          loading: false,
          type: this.props.typeRoom,
          photo: data.avatar,
          participants: data.participants
        })
      }
    }, err => {
      ToastAndroid.show(err, ToastAndroid.SHORT)
    })
  }

  /**
   * add handling for back android to trigger chatroom to relaod
   */

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
    Actions.chatroom({
      type: ActionConst.POP_TO
    })
    return true // to prevent apps to exit
  }

  async newMessage (data) {
    // handling new message
    if (this.state.isActive) {
      if (String(data.room_id_str) === String(this.state.id)) {
        let tempData = await [...this.state.data]
        let index = tempData.map(function(uniq) { return uniq.unique_id; }).indexOf(data.unique_temp_id)
        const temp = {
          "attachment": null,
          "avatar": data.user_avatar,
          "before_id": data.comment_before_id,
          "date": data.timestamp,
          "id": data.id,
          "isDelivered": true,
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
        if (index > -1) {
          tempData[index] = temp
        } else {
          tempData.unshift(temp)
        }
        this.setState({
          data: tempData,
          lastMessageDate: moment(data.timestamp).format('YYYY-MM-DD')
        })
      }
      qiscus.readComment(this.state.id, data.id);
    }
  }

  handleReadMessage (params) {
    if (this.state.isActive) {
      if (params.message !== undefined) {
        let tempData = [...this.state.data]
        for (let i = 0; i < tempData.length; i++) {
          tempData[i].isRead = true
        }
        this.setState({
          data: tempData
        })
      }
    }
  }

  handleTyping (params) {
    if (this.state.isActive) {
      if (this.state.participants.find((data) => data.email === params.username)) {
        if (params.message === '1') {
          this.setState({
            isTyping: true
          })
        } else if (params.message === '0') {
          this.setState({
            isTyping: false
          })
        }
      }
    }
  }

  async handleStatus (params) {
    if (this.state.isActive) {
      if (String(params).includes('1:')) {
        this.setState({
          isOnline: true
        })
      } else if (String(params).includes('0:')) {
        let tempTimestamp
        if (String(params).includes('/s')) {
          tempTimestamp = await String(params.substring(2, params.length - 2))
        } else {
          tempTimestamp = await String(params.substring(2, params.length))
        }
        this.setState({
          isOnline: false,
          lastSeen: I18n.t('lastSeen') + moment(parseInt(tempTimestamp)).format('HH:mm A')
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

  /**
   * open the profile of our friend in chat
   */

  profile () {
    const { type, participants, email, dataGroup } = this.state
    let index = participants[0].email === email ? 1 : 0
    switch (type) {
      case 'single':
        Actions.profile({
          type: ActionConst.PUSH,
          typeProfile: 'other',
          data: participants[index],
          emitter: this.emitter,
          qiscus: this.qiscus,
          id: this.state.id
        })
        break
      case 'group':
        Actions.profilegroup({
          type: ActionConst.PUSH,
          data: participants,
          emitter: this.emitter,
          qiscus: this.qiscus,
          dataGroup: dataGroup,
          id: this.state.id,
          callback: this.state.callback
        })
        break
      default:
        break
    }
  }

  renderList () {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
      </TouchableWithoutFeedback>
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
        onLongPress={() => this.onMessagePressed(item)}
        retryMessage={() => this.sendMessage(item)}
      />
    )
  }

  renderInput () {
    const { message, isReplying } = this.state
    let showReplied = isReplying ? this.renderReply() : null
    let sendIcon = message === '' ? Images.send : Images.sendActive
    return (
      <View style={{ flexDirection: 'column' }}>
        {showReplied}
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => this.setState({ attachment: true })}
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
                  setTimeout(() => {
                    qiscus.publishTyping(0)
                  }, 5000)
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
              <Image source={sendIcon} style={styles.imageButton} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  /**
   * render reply
   * uriImageReplied is used to check if the message replied contain uri image and caption
   * so if the message is [file] or the uriImageReplied is not ''
   * then handling for reply message with image is triggered
   * caption from replied image message is assigned to variable messageReply
   */

  renderReply () {
    const { nameUserReplied, messageReply, uriImageReplied } = this.state
    let messagePreview, renderRepliedMessage, renderRepliedImage, messageImage
    let extImage = ['.jpg','.gif','.jpeg','.png', '.JPG', '.GIF', '.JPEG', '.PNG']
    let isImage = extImage.find((data) => messageReply.includes(data))
    if ((isImage && messageReply.includes('[file]') || uriImageReplied !== '')) {
      messageImage = messageReply.substring(6, messageReply.length-7).trim()
      if (messageReply === undefined) {
        renderRepliedMessage = null
        renderRepliedImage = (
          <Image
            style={[styles.imageMessage,{ marginRight: 5}]}
            source={{ uri: messageImage }}
          />
        )
      } else if (messageReply !== '') {
        messageImage = uriImageReplied.substring(6, uriImageReplied.length-7).trim()
        renderRepliedMessage = <Text style={styles.textMessage}>{messageReply}</Text>
        renderRepliedImage = (
          <Image
            style={[styles.imageMessage,{ marginRight: 5}]}
            source={{ uri: messageImage }}
          />
        )
      } else {
        messageImage = uriImageReplied.substring(6, uriImageReplied.length-7).trim()
        renderRepliedMessage = null
        renderRepliedImage = (
          <Image
            style={[styles.imageMessage,{ marginRight: 5}]}
            source={{ uri: messageImage }}
          />
        )
      }
    } else {
      if (messageReply.length < 50) {
        messagePreview = messageReply.replace(/\n/g, ' ')
      } else {
        messagePreview = messageReply.replace(/\n/g, ' ')
        messagePreview = messagePreview.substr(0, 49) + '...'
      }
      renderRepliedMessage = <Text style={styles.textMessage}>{messagePreview}</Text>
      renderRepliedImage = null
    }
    return (
      <View style={styles.replyContainer}>
        <View style={{ flexDirection: 'column' }}>
          <View style={styles.greenBar} />
        </View>
        <View style={styles.contentReplyContainer}>
          <Text style={styles.textName}>{nameUserReplied}</Text>
          {renderRepliedMessage}
        </View>
        <View style={{ flex: 1 }} />
        {renderRepliedImage}
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
    const { messageOption, pendingMessage } = this.state
    let menuReply = !pendingMessage ? this.renderMenu(Images.reply, I18n.t('reply')) : null
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
              {menuReply}
              {/* {this.renderMenu(Images.forward, I18n.t('forward'))} */}
              {this.renderMenu(Images.copy, I18n.t('copy'))}
              <View style={styles.border} />
              {this.renderMenu(Images.cancel, I18n.t('cancel'))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  renderModalAttachment () {
    const { attachment } = this.state
    return (
      <Modal
        animationType={'fade'}
        transparent
        visible={attachment}
        onRequestClose={() => this.setState({ attachment: false })}
      >
        <TouchableWithoutFeedback onPress={() => this.setState({ attachment: false })}>
          <View style={styles.modalContainer}>
            <View style={{ flex: 1 }} />
            <View style={styles.optionContainer}>
              {this.renderMenu(Images.camera, I18n.t('camera'))}
              {this.renderMenu(Images.gallery, I18n.t('gallery'))}
              {this.renderMenu(Images.file, I18n.t('file'))}
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
        break
      case I18n.t('copy'):
        await Clipboard.setString(this.state.messageReply)
        this.setState({ messageOption: false })
        ToastAndroid.show(I18n.t('messageCopied'), ToastAndroid.SHORT)
        break
      case I18n.t('cancel'):
        this.setState({ messageOption: false, attachment: false })
        break
      case I18n.t('camera'):
        this.setState({ attachment: false })
        this.openMedia('camera')
        break
      case I18n.t('gallery'):
        this.setState({ attachment: false })
        this.openMedia('gallery')
        break
      default:
        break;
    }
  }

  async onMessagePressed (item) {
    let tempMessage, uriImage, tempName, pending
    if (item.payload === null) {
      tempMessage = await item.message
      uriImage = ''
    } else if (item.payload !== null) {
      if (item.payload.text !== undefined) {
        tempMessage = await item.payload.text
        uriImage = ''
      } else if (item.payload.caption !== undefined) {
        tempMessage = await item.payload.caption
        uriImage = await item.message
      }
    }
    tempName = item.username_as === undefined ? this.state.name : item.username_as
    if (item.isPending) {
      pending = true
    } else {
      pending = false
    }
    this.setState({
      messageOption: true,
      idReply: item.id,
      emailUserReplied: item.username_real,
      nameUserReplied: tempName,
      messageReply: tempMessage,
      uriImageReplied: uriImage,
      pendingMessage: pending
    })
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

  /**
   * send message perlu temp uniq id
   */

  sendMessage (item) {
    const { id, message, firstCommentId, isReplying, nameUserReplied, emailUserReplied, messageReply, idReply, data } = this.state
    let tempData = [...data]
    let temp
    if (item === undefined || item === null) {
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
          temp = {
            "attachment": null,
            "avatar": this.state.photo,
            "before_id": -1,
            "date": -1,
            "id": String(moment().unix()),
            "isDelivered": false,
            "isFailed": false,
            "isPending": true,
            "isRead": false,
            "isSent": false,
            "is_deleted": false,
            "message": message,
            "payload": payload,
            "status": "read",
            "subtype": null,
            "time": moment().format('HH:mm A'),
            "timestamp": moment().unix(),
            "type": 'reply',
            "unique_id": String(moment().unix()),
            "username_as": this.state.name,
            "username_real": this.state.email
          }
          tempData.unshift(temp)
          this.setState({
            data: tempData,
            message: '',
            isReplying: false
          })
          qiscus.sendComment(id, message, String(moment().unix()), 'reply', JSON.stringify(payload))
            .then(() => {
              qiscus.publishTyping(0)
            })
            .catch((e) => {
              let tempArrayFailedData = [...tempData]
              let failedTempData = tempArrayFailedData[0]
              failedTempData.isPending = false
              failedTempData.isFailed = true
              tempArrayFailedData[0] = failedTempData
              this.setState({
                data: tempArrayFailedData
              })
            })
        } else {
          temp = {
            "attachment": null,
            "avatar": this.state.photo,
            "before_id": -1,
            "date": -1,
            "id": String(moment().unix()),
            "isDelivered": false,
            "isFailed": false,
            "isPending": true,
            "isRead": false,
            "isSent": false,
            "is_deleted": false,
            "message": message,
            "payload": null,
            "status": "read",
            "subtype": null,
            "time": moment().format('HH:mm A'),
            "timestamp": moment().unix(),
            "type": "text",
            "unique_id": String(moment().unix()),
            "username_as": this.state.name,
            "username_real": this.state.email
          }
          tempData.unshift(temp)
          this.setState({
            data: tempData,
            message: '',
            isReplying: false
          })
          qiscus.sendComment(id, message, String(moment().unix()))
          .then(() => {
            qiscus.publishTyping(0)
          })
          .catch((e) => {
            let tempArrayFailedData = [...tempData]
            let failedTempData = tempArrayFailedData[0]
            failedTempData.isPending = false
            failedTempData.isFailed = true
            tempArrayFailedData[0] = failedTempData
            this.setState({
              data: tempArrayFailedData
            })
          })
        }
      }
    } else {
      if (item.message.length > 0) {
        if (item.payload === undefined || item.payload === null) {
          temp = {
            "attachment": null,
            "avatar": this.state.photo,
            "before_id": -1,
            "date": -1,
            "id": item.id,
            "isDelivered": false,
            "isFailed": false,
            "isPending": true,
            "isRead": false,
            "isSent": false,
            "is_deleted": false,
            "message": item.message,
            "payload": null,
            "status": "read",
            "subtype": null,
            "time": item.time,
            "timestamp": item.timestamp,
            "type": 'reply',
            "unique_id": item.unique_id,
            "username_as": this.state.name,
            "username_real": this.state.email
          }
          let index = tempData.map(function(uniq) { return uniq.unique_id; }).indexOf(item.unique_id)
          tempData[index].isFailed = false
          tempData[index].isPending = true
          this.setState({
            data: tempData
          })
          qiscus.sendComment(id, item.message, item.unique_id)
          .then(() => {
            qiscus.publishTyping(0)
          })
          .catch((e) => {
            let tempArrayFailedData = [...tempData]
            let failedTempData = tempArrayFailedData[index]
            failedTempData.isPending = false
            failedTempData.isFailed = true
            tempArrayFailedData[index] = failedTempData
            this.setState({
              data: tempArrayFailedData
            })
          })
        } else {
          const payload = item.payload
          temp = {
            "attachment": null,
            "avatar": this.state.photo,
            "before_id": -1,
            "date": -1,
            "id": item.id,
            "isDelivered": false,
            "isFailed": false,
            "isPending": true,
            "isRead": false,
            "isSent": false,
            "is_deleted": false,
            "message": item.message,
            "payload": payload,
            "status": "read",
            "subtype": null,
            "time": item.time,
            "timestamp": item.timestamp,
            "type": 'reply',
            "unique_id": item.unique_id,
            "username_as": this.state.name,
            "username_real": this.state.email
          }
          let index = tempData.map(function(uniq) { return uniq.unique_id; }).indexOf(item.unique_id)
          tempData[index].isFailed = false
          tempData[index].isPending = true
          this.setState({
            data: tempData
          })
          qiscus.sendComment(id, item.message, item.unique_id, 'reply', JSON.stringify(payload))
            .then(() => {
              qiscus.publishTyping(0)
            })
            .catch((e) => {
              let tempArrayFailedData = [...tempData]
              let failedTempData = tempArrayFailedData[index]
              failedTempData.isPending = false
              failedTempData.isFailed = true
              tempArrayFailedData[index] = failedTempData
              this.setState({
                data: tempArrayFailedData
              })
            })
        }
      }
    }
  }

  openMedia (type) {
    Actions.media({
      type: ActionConst.PUSH,
      typeAttach: type,
      idReply: this.state.idReply,
      nameUserReplied: this.state.nameUserReplied,
      emailUserReplied: this.state.emailUserReplied,
      messageReply: this.state.messageReply,
      isReplying: this.state.isReplying,
      qiscus: this.props.qiscus,
      id: this.state.id
    })
  }

  renderContent (content) {
    if (Platform.OS === 'ios') {
      return (
        <KeyboardAvoidingView behavior='padding'>
          {content}
        </KeyboardAvoidingView>
      )
    } else {
      return content
    }
  }

  render () {
    const { data, loading, photo, isTyping, isOnline, type, lastSeen } = this.state
    let view, renderDate, renderInput, subtitle
    if (loading) {
      view = (
        <View />
      )
    } else {
      view = data.length > 0 ? this.renderList() : <EmptyState type='chat' />
      renderDate = data.length > 0 ? this.renderDate() : null
      renderInput = this.renderInput()
    }
    if (isTyping) {
      subtitle = type === 'single' ? I18n.t('typing') : I18n.t('groupTyping')
    } else if (isOnline) {
      subtitle = I18n.t('online')
    } else {
      subtitle = lastSeen
    }
    return (
      <View style={styles.container}>
        <Header
          title={this.state.name}
          onLeftPress={() => this.backAndroid()}
          showRightButton
          subtitle={subtitle}
          isLoading={loading}
          rightButtonImage={photo}
          onRightPress={() => this.profile()}
        />
        {renderDate}
        {view}
        {this.renderContent(renderInput)}
        {this.renderModalOptionMessage()}
        {this.renderModalAttachment()}
      </View>
    )
  }
}

export default ChatList
