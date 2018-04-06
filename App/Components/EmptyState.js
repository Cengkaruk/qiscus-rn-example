import React from 'react'
import { View, Image, Text } from 'react-native'
import { Colors, Images, Dictionary } from '../Themes'
import PropTypes from 'prop-types'
import { Actions, ActionConst } from 'react-native-router-flux'

import styles from './Styles/EmptyStateStyles'
import I18n from 'react-native-i18n'
import { Button } from '../Components'

I18n.locale = 'en'
I18n.translations = Dictionary 

export default class EmptyState extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      type: this.props.type, // 'room' => empty state for room list, 'chat' => empty state for chat
      showButton: this.props.showButton // show button for start chat (open contact)
    }
  }

  static propTypes = {
    type: PropTypes.string,
    showButton: PropTypes.bool
  }

  static defaultProps = {
    type: 'room',
    showButton: false
  }

  openContact () {
    Actions.contact({
      type: ActionConst.PUSH,
      qiscus: this.props.qiscus,
      emitter: this.props.emitter
    })
  }

  renderButton () {
    if (this.props.showButton) {
      return (
        <View style={styles.buttonContainer}>
          <Button
            label={I18n.t('startChat')}
            onPress={() => this.openContact()}
          />
        </View>
      )
    }
    return null
  }

  render () {
    let image, subtitle, description
    switch (this.props.type) {
      case 'room':
        image = Images.emptyRoom
        subtitle = I18n.t('emptyRoom')
        description = I18n.t('descriptionEmptyRoom')
        break
      case 'chat':
        image = Images.emptyChat
        subtitle = I18n.t('emptyChat')
        description = I18n.t('descriptionEmptyChat')
        break
      default:
        break
    }
    return (
      <View style={styles.container}>
        <Image source={image} style={styles.image} />
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.description}>{description}</Text>
        {this.renderButton()}
      </View>
    )
  }
}
