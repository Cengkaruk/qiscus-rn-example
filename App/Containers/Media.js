import React from 'react'
import I18n from 'react-native-i18n'
import {
  View,
  Image,
  TouchableOpacity,
  TextInput
} from 'react-native'

import { Actions, ActionConst } from 'react-native-router-flux'
import { ImagePicker } from 'expo'
import { Images, Dictionary } from '../Themes'

/**
 * import component
 */
import { Header } from '../Components'

import styles from './Styles/MediaStyles'

I18n.translations = Dictionary

class Media extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      imageName: 'Insert Image',
      imageUri: '',
      message: '',
      typeAttach: this.props.typeAttach // camera or gallery
    }
  }

  qiscus = this.props.qiscus

  async componentDidMount () {
    const type = await this.props.typeAttach
    if (type === 'camera') {
      this.openCamera()
    } else {
      this.openGallery()
    }
  }

  async openCamera () {
    let result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
      aspect: [4, 3]
    })
    this.setState({
      imageUri: result.uri,
      imageName: I18n.t('defaultImageName')
    })
    if (result.cancelled) {
      this.back()
    }
  }

  async openGallery () {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.5,
      mediaTypes: 'Images',
      aspect: [4, 3]
    })
    this.setState({
      imageUri: result.uri,
      imageName: I18n.t('defaultImageName')
    })
    if (result.cancelled) {
      this.back()
    }
  }

  back () {
    Actions.pop()
  }

  renderImage () {
    const { imageUri } = this.state
    let renderImage = imageUri === '' ? <View /> : <Image source={{ uri: imageUri }} style={styles.image} />
    return (
      <View style={styles.imageContainer}>
        {renderImage}
      </View>
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
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 8, paddingLeft: 10 }}>
              <TextInput
                placeholder={I18n.t('caption')}
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
              <Image source={sendIcon} style={styles.imageButton} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  renderReply () {
    return null
  }

  sendMessage () {
  }

  render () {
    return (
      <View style={styles.container}>
        <Header
          title={this.state.imageName}
          onLeftPress={() => this.back()}
        />
        {this.renderImage()}
        {this.renderInput()}
      </View>
    )
  }
}

export default Media
