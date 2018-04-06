import React from 'react'
import I18n from 'react-native-i18n'
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Text
} from 'react-native'

import { Actions, ActionConst } from 'react-native-router-flux'
import { Images, Dictionary } from '../Themes'

/**
 * import component
 */
import { Header } from '../Components'

import styles from './Styles/ProfileStyles'

I18n.locale = 'en'
I18n.translations = Dictionary

class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      typeProfile: this.props.typeProfile, // self, other
      data: this.props.data // data profile
    }
  }

  qiscus = this.props.qiscus
  emitter = this.props.emitter

  renderPhoto () {
    const { data, typeProfile } = this.state
    let changePhotoButton = typeProfile === 'self' ? (
      <TouchableOpacity onPress={() => {}}>
        <Image source={Images.changeImage} style={styles.icon} />
      </TouchableOpacity>
    ) : null
    return (
      <ImageBackground
        style={styles.photo}
        source={{ uri: data.avatar_url }}
        resizeMode='cover'
      >
        {changePhotoButton}
      </ImageBackground>
    )
  }

  renderInformation () {
    const { data, typeProfile } = this.state
    let editName = typeProfile === 'self' ? (
      <TouchableOpacity onPress={() => {}}>
        <Image source={Images.edit} style={styles.icon} />
      </TouchableOpacity>
    ) : null
    return (
      <View style={styles.infoContainer}>
        <Text style={styles.textLabel}>{I18n.t('information')}</Text>
        <View style={styles.idContainer}>
          <View style={styles.nameContainer}>
            <Image source={Images.contact} style={styles.icon} />
            <Text style={styles.textData}>{data.username}</Text>
            {editName}
          </View>
          <View style={{ height: 20 }} />
          <View style={styles.nameContainer}>
            <Image source={Images.id} style={styles.icon} />
            <Text style={styles.textData}>{data.email}</Text>
          </View>
        </View>
      </View>
    )
  }

  renderLogoutButton () {
    const { typeProfile } = this.state
    let onPress, label
    switch (typeProfile) {
      case 'self':
        label = I18n.t('logout')
        icon = Images.logout
        break
      case 'other':
        label = I18n.t('sendMessage')
        icon = Images.search
        break
      default:
        break
    }
    return (
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.nameContainer} onPress={() => this.onPress(label)}>
          <Image source={icon} style={styles.icon} />
          <Text style={styles.textData}>{label}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  onPress (label) {
    const { data } = this.state
    switch (label) {
      case I18n.t('logout'):
        qiscus.logout()
        Actions.login({
          type: ActionConst.RESET
        })
        break
      case I18n.t('sendMessage'):
        qiscus.chatTarget(data.email).then(result => {
          this.openChat(result)
        })
        break
      default:
        break
    }
  }

  async openChat (result) {
    let currentUser = await qiscus.userData
    let index = currentUser.email === result.participants[0].email ? 1 : 0
    Actions.chatlist({
      type: ActionConst.PUSH,
      id: result.id,
      roomName: result.participants[index].username,
      email: currentUser.email,
      typeRoom: result.room_type,
      qiscus: qiscus,
      emitter: this.emitter
    })
  }

  render () {
    const { typeProfile } = this.state
    return (
      <View style={styles.container}>
        <Header title={typeProfile === 'self' ? I18n.t('profile') : this.props.data.username} />
        {this.renderPhoto()}
        {this.renderInformation()}
        {this.renderLogoutButton()}
      </View>
    )
  }
}

export default Profile
