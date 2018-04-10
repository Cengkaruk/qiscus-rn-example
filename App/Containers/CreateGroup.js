import React from 'react'
import I18n from 'react-native-i18n'
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  TextInput,
  Modal,
  TouchableWithoutFeedback
} from 'react-native'
import axios from 'axios'
import { baseUriUploadImage } from '../config'

import { Actions, ActionConst } from 'react-native-router-flux'
import { Images, Dictionary, Colors } from '../Themes'

var ImagePicker = require('react-native-image-picker')

/**
 * import component
 */
import { Header, ListContact } from '../Components'

import styles from './Styles/CreateGroupStyles'

I18n.locale = 'en'
I18n.translations = Dictionary

class CreateGroup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: this.props.data,
      name: '',
      photo: '',
      loading: false,
      openModal: false,
      email: ''
    }
  }

  qiscus = this.props.qiscus
  emitter = this.props.emitter

  componentDidMount () {
    let data = qiscus.userData
    this.setState({
      email: data.email
    })
  }

  renderInfoGroup () {
    const { name, photo } = this.state
    let img = photo.length > 0 ? { uri: photo }: Images.groupAvatar
    let style = photo.length > 0 ? { resizeMode: 'cover' } : {}
    return (
      <View style={styles.infoContainer}>
        <TouchableOpacity
          style={{ marginRight: 20 }}
          onPress={() => this.setState({ openModal: true })}
        >
          <Image source={img} style={[styles.photo, style]} />
        </TouchableOpacity>
        <View style={styles.nameContainer}>
          <Text style={styles.labelName}>{I18n.t('groupName')}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder={I18n.t('groupName')}
              underlineColorAndroid='transparent'
              style={styles.input}
              value={name}
              onChangeText={(text) => {
                this.setState({ name: text })}
              }
              autoCapitalize='none'
              autoCorrect={false}
            />
          </View>
        </View>
      </View>
    )
  }

  renderParticipants () {
    return (
      <View style={styles.participantsContainer}>
        <Text style={styles.label}>{I18n.t('participants')}</Text>
        <FlatList
          data={this.state.data}
          renderItem={this.renderitem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    )
  }

  renderitem = ({ item, index }) => {
    const { isCreatingGroup } = this.state
    return (
      <ListContact
        name={item.name}
        photo={item.avatar_url}
        onPress={() => {this.removeMember(item)}}
        isChecking={item.isChecking}
        isCreatingGroup
        type='remove'
      />
    )
  }

  renderModalUploadPhoto () {
    const { openModal } = this.state
    return (
      <Modal
        animationType={'fade'}
        transparent
        visible={openModal}
        onRequestClose={() => this.setState({ openModal: false })}
      >
        <TouchableWithoutFeedback onPress={() => this.setState({ openModal: false })}>
          <View style={styles.modalContainer}>
            <View style={{ flex: 1 }} />
            <View style={styles.optionContainer}>
              {this.renderMenu(Images.camera, I18n.t('camera'))}
              {this.renderMenu(Images.gallery, I18n.t('gallery'))}
              <View style={styles.border} />
              {this.renderMenu(Images.cancel, I18n.t('cancel'))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  renderMenu (images, label) {
    const newStyle = label === I18n.t('cancel') ? { color: Colors.red } : {}
    return (
      <TouchableOpacity
        style={styles.menuContainer}
        onPress={() => this.menuHandler(label)}
      >
        <Image source={images} style={styles.iconMenu} />
        <Text style={[styles.textMenu, newStyle]}>{label}</Text>
      </TouchableOpacity>
    )
  }

  removeMember (item) {
    const { data } = this.state
    let tempData = [...data]
    let index = data.indexOf(item)
    tempData.splice(index, 1)
    this.setState({
      data: tempData
    })
    if (tempData.length < 1) {
      Actions.pop()
    }
  }

  async menuHandler (label) {
    switch (label) {
      case I18n.t('cancel'):
        this.setState({ openModal: false })
        break
      case I18n.t('camera'):
        this.openMedia('camera')
        break
      case I18n.t('gallery'):
        this.openMedia('gallery')
        break
      default:
        break;
    }
  }

  openMedia (type) {
    if (type === 'camera') {
      ImagePicker.launchCamera({}, (response)  => {
        if (response.didCancel) {
          this.setState({
            openModal: false
          })
        } else if (response.error) {
          this.setState({
            openModal: false
          })
          console.log('ImagePicker Error: ', response.error);
        }
        this.setState({
          photo: response.uri,
          openModal: false
        })
      })
    } else {
      ImagePicker.launchImageLibrary({}, (result)  => {
        if (result.didCancel) {
          this.setState({
            openModal: false
          })
        } else if (result.error) {
          this.setState({
            openModal: false
          })
          console.log('ImagePicker Error: ', result.error);
        }
        this.setState({
          photo: result.uri,
          openModal: false
        })
      })
    }
  }

  uploadImage () {
    const { data, name, photo } = this.state
    let tempData = []
    for (let i = 0; i < data.length; i++) {
      tempData.push(data[i].email)
    }
    if (name !== '' && photo.length > 0) {
      this.setState({ loading: true })
        const form = new FormData()
        form.append('file', { uri: photo, type: 'image/jpg', name: 'image.jpg' })
        axios.post(baseUriUploadImage,
          form
        ,{
          timeout: 10000
        })
        .then((response) => {
          this.createGroup(tempData, name, response.data.results.file.url)
        })
        .catch(function (error) {
          ToastAndroid.show(error.message, ToastAndroid.SHORT)
        })
    }
  }

  createGroup (data, name, imageUri) {
    let options = {
      avatar_url: imageUri
    }
    qiscus.createGroupRoom(name, data, options)
        .then(result => {
          Actions.chatlist({
            type: ActionConst.PUSH,
            id: result.id,
            roomName: result.name,
            email: this.state.email,
            typeRoom: 'group',
            qiscus: this.qiscus,
            emitter: this.emitter
          })
          this.setState({
            loading: false
          })
        }, err => {
          this.setState({
            loading: false
          })
          console.log(String(err))
        })
  }

  render () {
    return (
      <View style={styles.container}>
        <Header
          title={I18n.t('groupInfo')}
          showRightButton
          isLoading={this.state.loading}
          rightButtonImage={Images.check}
          onRightPress={() => this.uploadImage()}
        />
        {this.renderInfoGroup()}
        {this.renderParticipants()}
        {this.renderModalUploadPhoto()}
      </View>
    )
  }
}

export default CreateGroup
