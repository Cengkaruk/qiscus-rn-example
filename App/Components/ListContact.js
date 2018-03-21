import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native'

import PropTypes from 'prop-types'

import styles from './Styles/ListContactStyles'
import I18n from 'react-native-i18n'

import { Dictionary } from '../Themes'

I18n.translations = Dictionary

export default class ListContact extends React.PureComponent {
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
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        activeOpacity={0.5}
        onPress={() => this.props.onPress()}
      >
        <Image source={{ uri: this.props.photo }} style={styles.photo} />
        <View style={styles.item}>
          <View style={{ flexDirection: 'column', flex: 1, marginRight: 15 }}>
            <Text style={styles.textName}>{this.props.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}
