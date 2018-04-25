import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native'

import PropTypes from 'prop-types'

import ImageLoad from 'react-native-image-placeholder'
import styles from './Styles/ListRoomStyles'
import I18n from 'react-native-i18n'

import { Dictionary, Images } from '../Themes'

I18n.locale = 'en'
I18n.translations = Dictionary

export default class ListRoom extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      unreadCount: this.props.unreadCount,
      avatar: this.props.avatar,
      name: this.props.name,
      lastMessage: this.props.lastMessage,
      date: this.props.date
    }
  }

  static propTypes = {
    unreadCount: PropTypes.number,
    avatar: PropTypes.string,
    name: PropTypes.string,
    lastMessage: PropTypes.string,
    date: PropTypes.string,
    onPress: PropTypes.func
  }

  render () {
    let viewUnread, lastMessage
    if (this.props.unreadCount > 0) {
      viewUnread = (
        <View style={styles.unreadContainer}>
          <Text style={styles.textUnread}>{this.props.unreadCount}</Text>
        </View>
      )
    } else if (this.props.unreadCount >= 999) {
      viewUnread = (
        <View style={[styles.unreadContainer, { padding: 2 }]}>
          <Text style={styles.textUnread}>999</Text>
        </View>
      )
    }

    let extImage = ['.jpg','.gif','.jpeg','.png', '.JPG', '.GIF', '.JPEG', '.PNG']
    let isImage = extImage.find((data) => this.props.lastMessage.includes(data))
    if (isImage) {
      lastMessage = I18n.t('image')
    } else if (this.props.lastMessage.includes('[file]')) {
      lastMessage = I18n.t('fileAttachment')
    } else {
      lastMessage = this.props.lastMessage
    }
    
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        activeOpacity={0.8}
        onPress={() => this.props.onPress()}
      >
        <ImageLoad
          style={styles.photo}
          source={{ uri: this.props.avatar }}
          isShowActivity={false}
          resizeMode='cover'
          borderRadius={20}
          placeholderSource={Images.loading}
          placeholderStyle={styles.photo}
        />
        <View style={styles.item}>
          <View style={{ flexDirection: 'column', flex: 1, marginRight: 15 }}>
            <Text style={styles.textName}>{this.props.name}</Text>
            <Text style={styles.textMessage}>{lastMessage}</Text>
          </View>
          <View>
            <Text style={styles.textMessage}>{this.props.date}</Text>
            {viewUnread}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}
