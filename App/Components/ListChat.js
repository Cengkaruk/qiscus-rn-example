import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking
} from 'react-native'

import PropTypes from 'prop-types'
import I18n from 'react-native-i18n'
import ImageLoad from 'react-native-image-placeholder'

import styles from './Styles/ListChatStyles'
import { Colors, Images, Dictionary } from '../Themes'

I18n.translations = Dictionary

export default class ListChat extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      email: this.props.email,
      emailSender: this.props.emailSender,
      type: this.props.type,
      message: this.props.message,
      time: this.props.time,
      isFirst: this.props.isFirst,
      name: this.props.name,
      photo: this.props.photo,
      isDelivered: this.props.isDelivered,
      isFailed: this.props.isFailed,
      isPending: this.props.isPending,
      isRead: this.props.isRead,
      isSent: this.props.isSent,
      payload: this.props.payload
    }
  }

  static propTypes = {
    email: PropTypes.string,
    emailSender: PropTypes.string,
    type: PropTypes.string,
    message: PropTypes.string,
    time: PropTypes.string,
    isFirst: PropTypes.bool,
    name: PropTypes.string,
    photo: PropTypes.string,
    isDelivered: PropTypes.bool,
    isFailed: PropTypes.bool,
    isPending: PropTypes.bool,
    isRead: PropTypes.bool,
    isSent: PropTypes.bool,
    onLongPress: PropTypes.func
  }

  renderSelfStatus () {
    const { isDelivered, isFailed, isPending, isRead, isSent } = this.props
    if (isRead) {
      return <Image source={Images.isRead} style={styles.statusRead} />
    } else if (isDelivered) {
      return <Image source={Images.isDelivered} style={styles.statusDelivered} />
    } else if (isPending) {
      return <Image source={Images.isPending} style={styles.statusPending} />
    } else if (isFailed) {
      return <Image source={Images.isFailed} style={styles.statusFailed} />
    }
  }
  
  renderMessage (message) {
    let extImage = ['.jpg','.gif','.jpeg','.png', '.JPG', '.GIF', '.JPEG', '.PNG']
    let messageImage
    let isImage = extImage.find((data) => message.includes(data))
    if (this.props.payload !== null && this.props.payload !== undefined && this.props.payload.url === undefined) {
      return <Text style={styles.textMessage}>{this.props.payload.text}</Text>
    } else if (isImage && message.includes('[file]')) {
      messageImage = message.substring(6, message.length-7).trim()
      return (
        <View style={{ flexDirection: 'column' }}>
          <ImageLoad
            style={styles.imageMessage}
            source={{ uri: messageImage }}
            isShowActivity={false}
            resizeMode='cover'
            borderRadius={6}
            placeholderSource={Images.loading}
            placeholderStyle={styles.imageMessage}
          />
          {this.renderCaption()}
        </View>
      )
    } else if (message.includes('[file]')) {
      messageImage = message.substring(6, message.length-7).trim()
      return (
        <TouchableOpacity
          onPress={() =>
            Linking
              .openURL(messageImage)
              .catch(err => console.error('An error occurred', err))
          }>
          <Text style={[styles.textMessage, { color: Colors.blue, textDecorationLine: 'underline' }]}>
            {messageImage}
          </Text>
        </TouchableOpacity>
      )
    } else if (message.includes('http')) {
      return (
        <TouchableOpacity
          onPress={() =>
            Linking
              .openURL(message)
              .catch(err => console.error('An error occurred', err))
          }>
          <Text style={[styles.textMessage, { color: Colors.blue, textDecorationLine: 'underline' }]}>
            {message}
          </Text>
        </TouchableOpacity>
      )
    } else {
      return <Text style={styles.textMessage}>{message}</Text>
    }
  }

  renderCaption () {
    const caption = this.props.payload.caption
    if (caption === undefined || caption === '') {
      return null
    }
    return <Text style={[styles.textMessage, {marginTop: 5, marginBottom: -2} ]}>{this.props.payload.caption}</Text>
  }

  renderMessageRetry () {
    const { isFailed } = this.state
    if (isFailed) {
      return (
        <View style={{ flexDirection: 'row', marginRight: 5, marginBottom: 5 }}>
          <View style={{ flex: 1 }} />
          <Text style={styles.textFailed}>{I18n.t('isFailed')}</Text>
          <TouchableOpacity>
            <Text style={[styles.textFailed, { color: Colors.green }]}>{I18n.t('retry')}</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  renderPayload () {
    if (this.props.payload !== null && this.props.payload !== undefined) {
      if (this.props.payload.replied_comment_message === undefined) return null
      let messageReplied, renderRepliedMessage
      messageReplied = this.props.payload.replied_comment_message
      let extImage = ['jpg','gif','jpeg','png', 'JPG', 'GIF', 'JPEG', 'PNG']
      let isImage = extImage.find((data) => messageReplied.includes(data))
      if (isImage && messageReplied.includes('[file]')) {
        messageReplied = messageReplied.substring(6, messageReplied.length-7).trim()
        renderRepliedMessage = (
          <Image
            style={styles.repliedImageMessage}
            source={{ uri: messageReplied }}
          />
        )
      } else {
        messageReplied = this.props.payload.replied_comment_message.replace(/\n/g, ' ')
        if (messageReplied.length > 50) {
          messageReplied = messageReplied.substr(0, 48) + '...'
        }
        renderRepliedMessage = <Text style={styles.replied}>{messageReplied}</Text>
      }
      const backgroundColor = this.props.email === this.props.emailSender ? Colors.lightGrey : Colors.background
      return (
        <View style={[styles.payloadContainer, { backgroundColor: backgroundColor }]}>
          <View style={styles.greenBar} />
          <View style={styles.textReplyContainer}>
            <Text style={[styles.name, { marginLeft: 0 }]}>
              {this.props.payload.replied_comment_sender_username}
            </Text>
            {renderRepliedMessage}
          </View>
        </View>
      )
    }
  }

  render () {
    const marginTop = this.props.isFirst ? 10 : 0
    let renderName = null
    let renderPhoto = null
    if (this.props.type === 'group') {
      if (this.props.isFirst) {
        renderName = (
          <Text style={styles.name}>{this.props.name}</Text>
        )
        renderPhoto = (
          <Image
            source={{ uri: this.props.photo }}
            style={styles.photo}
          />
        )
      } else {
        renderPhoto = (
          <View style={{ width: 40 }} />
        )
      }
    }
    if (this.props.email === this.props.emailSender) { // our message
      return (
        <View style={{ flexDirection: 'column', marginTop: marginTop }}>
          <View style={[styles.senderContainer]}>
            <View style={{ flex: 1 }} />
            <View style={[styles.statusContainer, { marginRight: 5 }]}>
              <Text style={styles.textDate}>{this.props.time}</Text>
              <View style={styles.imageStatusContainer}>
                {this.renderSelfStatus()}
              </View>
            </View>
            <TouchableOpacity
              style={styles.messageContainer}
              activeOpacity={0.8}
              onLongPress={() => this.props.onLongPress()}
            >
            {this.renderPayload()}
            {this.renderMessage(this.props.message)}
            </TouchableOpacity>
          </View>
          {this.renderMessageRetry()}
        </View>
      )
    } else { // others message
      return (
        <View style={[styles.senderContainer, { marginTop: marginTop }]}>
          {renderPhoto}
          <View style={{ flexDirection: 'column' }}>
            {renderName}
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={[styles.messageContainer, { backgroundColor: Colors.border }]}
                activeOpacity={0.8}
                onLongPress={() => this.props.onLongPress()}
              >
                {this.renderPayload()}
                {this.renderMessage(this.props.message)}
              </TouchableOpacity>
              <View style={[styles.statusContainer, { marginLeft: 5 }]}>
                <Text style={styles.textDate}>{this.props.time}</Text>
              </View>
            </View>
          </View>
          <View style={{ flex: 1 }} />
        </View>
      )
    }
  }
}
