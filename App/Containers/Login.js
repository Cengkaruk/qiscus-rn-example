import React from 'react'
import I18n from 'react-native-i18n'
import {
  View,
  Image,
  ImageBackground,
  ScrollView,
  ToastAndroid,
  AsyncStorage
} from 'react-native'

import { Actions, ActionConst } from 'react-native-router-flux'
import { Images, Dictionary } from '../Themes'
import qiscus from '../../libs/SDKCore'

/**
 * import component
 */
import { TextInputLogin, Button } from '../Components'

import styles from './Styles/LoginStyles'

I18n.translations = Dictionary

class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: 'fikri@qiscus.com',
      displayName: 'Fikri',
      key: 'password',
      loading: false,
      newMessage: []
    }
  }

  renderLogo () {
    return (
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={Images.logo} />
      </View>
    )
  }

  renderInputEmailAndDisplayName () {
    const { email, displayName, key } = this.state
    return (
      <View style={{ flexDirection: 'column' }}>
        <TextInputLogin
          label={I18n.t('email')}
          value={email}
          onChangeText={(value) => this.setState({email: value})}
        />
        <View style={styles.separator} />
        <TextInputLogin
          label={I18n.t('key')}
          value={key}
          secureTextEntry
          onChangeText={(value) => this.setState({key: value})}
        />
        <View style={styles.separator} />
        <TextInputLogin
          label={I18n.t('displayName')}
          value={displayName}
          onChangeText={(value) => this.setState({displayName: value})}
        />
      </View>
    )
  }

  renderButtonLogin () {
    return (
      <View style={styles.buttonContainer}>
        <Button
          label={I18n.t('start')}
          showArrow
          loading={this.state.loading}
          onPress={() => this.login()}
        />
      </View>
    )
  }

  /**
   * fuction qiscus.setUser is to login / register
   * all email are true if the email is not exist then qiscus make new user based on the email
   */

  /**
    * valid user to test is
    * const userAuth = {
      email: 'fikri@qiscus.com',
      password: 'password1',
      displayName: 'Fikri',
      avatar: null,
    }
    */

  login () {
    const { email, key, displayName } = this.state
    var format = /^([a-zA-Z0-9_\.])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    if (!format.test(email)) {
      ToastAndroid.show(I18n.t('invalidEmail'), ToastAndroid.SHORT)
    } else if (key.length < 1) {
      ToastAndroid.show(I18n.t('invalidKey'), ToastAndroid.SHORT)
    } else if (displayName.length < 1) {
      ToastAndroid.show(I18n.t('invalidDisplayName'), ToastAndroid.SHORT)
    } else {
      qiscus.init({
        AppId: 'sdksample',
        options: {
          loginSuccessCallback: (data) => this.successLogin(data), // if login / register is success
          loginErrorCallback: (data) => this.errorLogin(data), // if login / register is failed
          newMessagesCallback: (comments) => {
            // console.warn(comments)
            this.setState({ newMessage: comments })
          }
        }
      })
      this.setState({ loading: true }) // set the button to loading state
      qiscus.setUser(email, key, displayName, null)
    }
  }

  async successLogin (data) {
    Actions.chatroom({
      type: ActionConst.RESET, // reset the navigator to ListChat container
      photo: data.results.user.avatar_url, // passing params to chat room container
      email: this.state.email,
      qiscus: qiscus
    })
    AsyncStorage.setItem('token', data.results.user.token)
  }

  errorLogin (data) {
    const tempData = JSON.parse(data)
    ToastAndroid.show(tempData.error.message, ToastAndroid.SHORT)
    this.setState({ loading: false })
  }

  render () {
    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.imageBackground}
          source={Images.background}
          resizeMode='stretch'
        >
          <View style={styles.scrollViewContainer}>
            <ScrollView
              keyboardShouldPersistTaps='handled'
              showsVerticalScrollIndicator={false}
            >
              {this.renderLogo()}
              {this.renderInputEmailAndDisplayName()}
              {this.renderButtonLogin()}
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
    )
  }
}

export default Login
