import React from 'react'
import I18n from 'react-native-i18n'
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  Platform,
  KeyboardAvoidingView,
  PermissionsAndroid
} from 'react-native'

import axios from 'axios'
import { baseUriUploadImage } from '../config'
import { Actions, ActionConst } from 'react-native-router-flux'
// import { ImagePicker } from 'expo'
import { Images, Dictionary } from '../Themes'

var ImagePicker = require('react-native-image-picker')

/**
 * import component
 */
import { Header } from '../Components'

import styles from './Styles/MediaStyles'

I18n.locale = 'en'
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
    if (Platform.OS === 'ios') {
      this.openMedia()
    } else {
      try {
        const responseCamera = await PermissionsAndroid.check('android.permission.CAMERA')
        const responseStorage = await PermissionsAndroid.check('android.permission.READ_EXTERNAL_STORAGE')
        if (!responseCamera || !responseStorage) {
          this.requestCameraPermission(this.openMedia())
        } else {
          this.openMedia()
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  async openMedia () {
    const type = await this.props.typeAttach
    if (type === 'camera') {
      this.openCamera()
    } else {
      this.openGallery()
    }
  }

  async requestCameraPermission (callback) {
    try {
      const granted = await PermissionsAndroid.requestMultiple(
        [PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE]
      )
      console.tron.log(granted)
      if (granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted')
        callback()
      } else {
        console.log('Camera permission denied')
      }
    } catch (err) {
      console.log(err)
    }
  }

  openCamera = async () => {
    setTimeout(() => {
      ImagePicker.launchCamera({}, (response)  => {
        if (response.didCancel) {
          this.back()
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        }
        this.setState({
          imageUri: response.uri,
          imageName: I18n.t('defaultImageName')
        })
      })
    }, 600)
  }

  openGallery = async () => {
    setTimeout(() => {
      ImagePicker.launchImageLibrary({}, (result)  => {
        if (result.didCancel) {
          this.back()
        } else if (result.error) {
          console.log('ImagePicker Error: ', result.error);
        }
        this.setState({
          imageUri: result.uri,
          imageName: I18n.t('defaultImageName')
        })
      })
    }, 600)
    console.log('here')
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
        axios.post(baseUriUploadImage,
          form
        ,{
          timeout: 50000
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
