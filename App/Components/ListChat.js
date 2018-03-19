import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image as ImageReact,
  Linking
} from 'react-native'

import Image from 'react-native-image-progress'
import Progress from 'react-native-progress/Circle'

import PropTypes from 'prop-types'
import I18n from 'react-native-i18n'

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
      return <ImageReact source={Images.isRead} style={styles.statusRead} />
    } else if (isDelivered) {
      return <ImageReact source={Images.isDelivered} style={styles.statusDelivered} />
    } else if (isPending) {
      return <ImageReact source={Images.isPending} style={styles.statusPending} />
    } else if (isFailed) {
      return <ImageReact source={Images.isFailed} style={styles.statusFailed} />
    }
  }
  
  renderMessage (message) {
    let extImage = ['jpg','gif','jpeg','png', 'JPG', 'GIF', 'JPEG', 'PNG']
    let messageImage
    let isImage = extImage.find((data) => message.includes(data))
    if (isImage) {
      messageImage = message.substring(6, message.length-7).trim()
      return (
        <Image
          style={styles.imageMessage}
          imageStyle={{ borderRadius: 6, resizeMode: 'cover' }}
          source={{ uri: messageImage }}
          indicator={Progress}
          indicatorProps={{ color: Colors.green, size: 40 }}
        />
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
      if (this.props.payload === null || this.props.payload === undefined) {
        return <Text style={styles.textMessage}>{message}</Text>
      } else {
        return <Text style={styles.textMessage}>{this.props.payload.text}</Text>
      }
    }
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
      let messageReplied
      messageReplied = this.props.payload.replied_comment_message.replace(/\n/g, ' ')
      if (messageReplied.length > 50) {
        messageReplied = messageReplied.substr(0, 48) + '...'
      }
      const backgroundColor = this.props.email === this.props.emailSender ? Colors.lightGrey : Colors.background
      return (
        <View style={[styles.payloadContainer, { backgroundColor: backgroundColor }]}>
          <View style={styles.greenBar} />
          <View style={styles.textReplyContainer}>
            <Text style={[styles.name, { marginLeft: 0 }]}>
              {this.props.payload.replied_comment_sender_username}
            </Text>
            <Text style={styles.replied}>
              {messageReplied}
            </Text>
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
            imageStyle={{ borderRadius: 6, resizeMode: 'cover' }}
            indicator={Progress}
            indicatorProps={{ color: Colors.green, size: 10 }}
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
