import React from 'react'
import I18n from 'react-native-i18n'
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  Platform,
  KeyboardAvoidingView
} from 'react-native'

import axios from 'axios'
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
      id: this.props.id,
      imageName: 'Insert Image',
      imageUri: '',
      message: '',
      loading: false,
      typeAttach: this.props.typeAttach // camera or gallery
    }
  }

  qiscus = this.props.qiscus

  async componentDidMount () {
    const type = await this.props.typeAttach
    if (type === 'camera') {
      setTimeout(() => {
        this.openCamera()
      }, 500)
    } else {
      setTimeout(() => {
        this.openGallery()
      }, 600)
    }
  }

  openCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
      aspect: [4, 3],
      allowsEditing: true
    })
    this.setState({
      imageUri: result.uri,
      imageName: I18n.t('defaultImageName')
    })
    if (result.cancelled) {
      this.back()
    }
  }

  openGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.5,
      mediaTypes: 'Images',
      aspect: [4, 3],
      allowsEditing: true
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
              onPress={() => this.uploadImage()}
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

  uploadImage () {
    const { imageUri, loading } = this.state
    if (!loading) {
      if (imageUri !== '') {
        this.setState({ loading: true })
        const form = new FormData()
        form.append('file', { uri: imageUri, type: 'image/jpg', name: 'image.jpg' })
        axios.post('https://sdksample.qiscus.com/api/v2/mobile/upload',
          form
        ,{
          timeout: 10000
        })
        .then((response) => {
          this.sendMessage(response.data.results.file.url)
        })
        .catch(function (error) {
          ToastAndroid.show(error.message, ToastAndroid.SHORT)
        })
      }
    }
  }
  
  sendMessage (image) {
    const { id, message } = this.state
    const payload = {
      "url": image,
      "caption": message
    }
    qiscus.sendComment(id, message, null, 'file_attachment', JSON.stringify(payload))
      .then(() => {
        this.setState({ loading: false })
        Actions.pop()
        qiscus.publishTyping(0)
      })
      .catch((e) => console.log(e))
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
    return (
      <View style={styles.container}>
        <Header
          title={this.state.imageName}
          onLeftPress={() => this.back()}
          isLoading={this.state.loading}
        />
        {this.renderImage()}
        {this.renderContent(this.renderInput())}
      </View>
    )
  }
}

export default Media
