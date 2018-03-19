import React from 'react'
import { TouchableOpacity, View, Text, Image, ActivityIndicator } from 'react-native'
import { Colors, Images } from '../Themes'
import PropTypes from 'prop-types'

import styles from './Styles/ButtonStyles'

export default class Button extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showArrow: this.props.showArrow
    }
  }

  /**
   * propTypes is used to set the data type and default value
   */

  static propTypes = {
    showArrow: PropTypes.bool,
    onPress: PropTypes.func
  }

  static defaultProps = {
    showArrow: false,
    onPress: {}
  }

  renderArrow () {
    const { showArrow } = this.state
    if (showArrow) {
      return <Image style={styles.nextArrow} source={Images.nextArrow} />
    } else {
      return null
    }
  }

  renderContent () {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.textButton}>{this.props.label}</Text>
        {this.renderArrow()}
      </View>
    )
  }

  renderLoading () {
    return <ActivityIndicator size='large' color={Colors.background} />
  }

  render () {
    const { showArrow } = this.state
    let loading = this.props.loading
    const styleButton = showArrow ? styles.buttonFull : styles.buttonNotFull
    let content = !loading ? this.renderContent() : this.renderLoading() // change content of button to activity indicator react native
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styleButton}
          onPress={() => this.props.onPress()}
        >
          {content}
        </TouchableOpacity>
      </View>
    )
  }
}
