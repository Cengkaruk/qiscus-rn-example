import React from 'react'
import { TouchableOpacity, View, Text, Image, ActivityIndicator, Platform } from 'react-native'
import I18n from 'react-native-i18n'
import { Actions, ActionConst } from 'react-native-router-flux'
import { Colors, Images, Dictionary } from '../Themes'
import ImageLoad from 'react-native-image-placeholder'
import PropTypes from 'prop-types'

import styles from './Styles/HeaderStyles'

I18n.translations = Dictionary

export default class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      leftButtonImage: this.props.leftButtonImage,
      title: this.props.title,
      showRightButton: this.props.showRightButton,
      rightButtonImage: this.props.rightButtonImage
    }
  }

  /**
   * propTypes is used to set the data type and default value
   * leftButtonImage is props for image in the left side,
   * title is props for title on the header
   * showRightButton is optional, can be shown or not, default value is false (hidden)
   * onLeftPressed is props for function if the left button is tapped / pressed, default value is pop to previous container
   * onRightPressed is props for function if the right button is tapped / pressed, default value is null
   * isLoading is props to set if header need to be in loading state
   * subtitle is props to subtitle on the header (below the title)
   */

  static propTypes = {
    title: PropTypes.string,
    showRightButton: PropTypes.bool,
    onLeftPress: PropTypes.func,
    onRightPress: PropTypes.func,
    isLoading: PropTypes.bool,
    subtitle: PropTypes.string
  }

  static defaultProps = {
    leftButtonImage: Images.back,
    title: '',
    showRightButton: false,
    rightButtonImage: Images.nextArrow,
    onLeftPress: () => Actions.pop(),
    onRightPress: () => {},
    isLoading: false,
    subtitle: ''
  }

  renderLeft () {
    let image, roundImage
    if (this.props.leftButtonImage === undefined) {
      image = Images.back
      roundImage = { borderRadius: 0, resizeMode: 'contain' }
    } else {
      if (String(this.props.leftButtonImage).includes('http')) {
        image = { uri: this.props.leftButtonImage }
        roundImage = { borderRadius: Platform.OS === 'ios' ? 12 : 160, resizeMode: 'cover' }
      } else {
        image = this.state.leftButtonImage
        roundImage = { borderRadius: 0, resizeMode: 'contain' }
      }
    }
    return (
      <View style={styles.leftContainer}>
        <TouchableOpacity onPress={() => this.props.onLeftPress()}>
          <ImageLoad
            style={styles.imageLeft}
            source={image}
            isShowActivity={false}
            resizeMode='contain'
            borderRadius={roundImage.borderRadius}
            placeholderSource={null}
            placeholderStyle={styles.imageLeft}
          />
        </TouchableOpacity>
      </View>
    )
  }

  renderTitle () {
    let loading = this.props.isLoading
    let title, subtitle
    if (loading) {
      title = (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='small' color={Colors.green} />
          <Text style={[styles.textTitle, { marginLeft: 5 }]}>{I18n.t('loading')}</Text>
        </View>
      )
    } else {
      switch (this.props.subtitle) {
        case I18n.t('online'):
          subtitle = (
            <Text style={styles.textOnline}>
              {this.props.subtitle}
            </Text>
          )
          break
        case I18n.t('typing'):
          subtitle = (
            <Text style={styles.textOnline}>
              {this.props.subtitle}
            </Text>
          )
          break
        case I18n.t('groupTyping'):
          subtitle = (
            <Text style={styles.textOnline}>
              {this.props.subtitle}
            </Text>
          )
          break
        case '':
          subtitle = null
          break
        default:
          subtitle = (
            <Text style={styles.textSubtitle}>
              {this.props.subtitle}
            </Text>
          )
          break
      }
      title = (
        <View style={styles.title}>
          <Text style={styles.textTitle}>{this.props.title}</Text>
          {subtitle}
        </View>
      )
    }
    return (
      <View style={styles.titleContainer}>
        {title}
      </View>
    )
  }

  renderRight () {
    let content
    let image
    let roundImage
    if (this.props.rightButtonImage === undefined) {
      image = Images.nextArrow
      roundImage = { borderRadius: 0, resizeMode: 'contain' }
    } else {
      if (String(this.props.rightButtonImage).includes('http')) {
        image = { uri: this.props.rightButtonImage }
        roundImage = { borderRadius: Platform.OS === 'ios' ? 12 : 160, resizeMode: 'cover' }
      } else {
        image = this.state.rightButtonImage
        roundImage = { borderRadius: 0, resizeMode: 'contain' }
      }
    }
    if (this.props.showRightButton) {
      content = (
        <TouchableOpacity onPress={() => this.props.onRightPress()}>
          <ImageLoad
            style={styles.imageLeft}
            source={image}
            isShowActivity={false}
            resizeMode={roundImage.resizeMode}
            borderRadius={roundImage.borderRadius}
            placeholderSource={null}
            placeholderStyle={styles.imageLeft}
          />
        </TouchableOpacity>
      )
    } else {
      content = null
    }
    return (
      <View style={styles.leftContainer}>
        {content}
      </View>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        {this.renderLeft()}
        {this.renderTitle()}
        {this.renderRight()}
      </View>
    )
  }
}
