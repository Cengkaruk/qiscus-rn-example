import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native'

import PropTypes from 'prop-types'

import styles from './Styles/ListGroupStyles'
import I18n from 'react-native-i18n'
import ImageLoad from 'react-native-image-placeholder'

import { Dictionary, Images } from '../Themes'

I18n.locale = 'en'
I18n.translations = Dictionary

export default class ListGroup extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      photo: this.props.photo,
      name: this.props.name
    }
  }

  static propTypes = {
    photo: PropTypes.string,
    name: PropTypes.string
  }

  render () {
    let name
    if (this.props.name.length > 7) {
      name = this.props.name.substring(0, 7) + '...'
    } else {
      name = this.props.name
    }
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        activeOpacity={0.5}
        onPress={() => this.props.onPress()}
      >
        <Image source={Images.delete} style={styles.iconDelete} />
        <ImageLoad
          style={styles.photo}
          source={{ uri: this.props.photo }}
          isShowActivity={false}
          resizeMode='cover'
          borderRadius={Platform.OS === 'ios' ? 20 : 160}
          placeholderSource={Images.loading}
          placeholderStyle={[styles.photo, { resizeMode: 'cover' }]}
        />
        <Text style={styles.textName}>{name}</Text>
      </TouchableOpacity>
    )
  }
}
