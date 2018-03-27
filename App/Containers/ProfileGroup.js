import React from 'react'
import I18n from 'react-native-i18n'
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  BackHandler
} from 'react-native'
import axios from 'axios'

import { Images, Dictionary, Colors } from '../Themes'

/**
 * import component
 */
import { Header, ListMember} from '../Components'

import styles from './Styles/ProfileGroupStyles'
import { Actions } from 'react-native-router-flux'

I18n.translations = Dictionary

class ProfileGroup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      id: this.props.id,
      data: this.props.data,
      dataGroup: this.props.dataGroup,
      openModal: false,
      selectedUser: {},
      loading: false,
      baseUri: 'https://sampleapp-65ghcsaysse.qiscus.com',
      callback: this.props.callback
    }
    console.log(this.props.callback)
  }

  qiscus = this.props.qiscus
  emitter = this.props.emitter

  componentDidMount () {
    BackHandler.addEventListener('hardwareBackPress', () => this.backAndroid())
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', () => this.backAndroid())
  }

  backAndroid () {
    Actions.pop({refresh: {callback: !this.state.callback} })
  }

  renderInfoGroup () {
    const { dataGroup } = this.state
    return (
      <ImageBackground
        style={styles.photo}
        source={{ uri: dataGroup.photo }}
        resizeMode='cover'
      >
      <View style={{ flex: 1 }} />
      <View style={styles.dataContainer}>
        <Text style={styles.name}>{dataGroup.name}</Text>
        <TouchableOpacity style={{ marginRight: 15 }}>
          <Image source={Images.editWhite} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={Images.changeImage} style={styles.icon} />
        </TouchableOpacity>
      </View>
      </ImageBackground>
    )
  }

  renderMember () {
    return (
      <View style={styles.memberContainer}>
        <Text style={styles.label}>{I18n.t('participants')}</Text>
        <ScrollView>
          <FlatList
            style={{ backgroundColor: Colors.background }}
            data={this.state.data}
            renderItem={this.renderitem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        </ScrollView>
      </View>
    )
  }

  renderitem = ({ item, index }) => {
    return (
      <ListMember
        photo={item.avatar_url}
        name={item.username}
        onPress={() => {
          if (!this.state.loading) {
            this.setState({
              selectedUser: item,
              openModal: true
            })
          }
        }}
      />
    )
  }

  renderModalDelete () {
    const { openModal, selectedUser, dataGroup } = this.state
    return (
      <Modal
        animationType={'fade'}
        transparent
        visible={openModal}
        onRequestClose={() => this.setState({ openModal: false })}
      >
        <TouchableWithoutFeedback onPress={() => this.setState({ openModal: false })}>
          <View style={styles.modalContainer}>
            <View style={styles.warningContainer}>
              <Text style={styles.warning}>
                {I18n.t('deleteMember', {
                  name: selectedUser.username,
                  roomName: dataGroup.name
                })}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.setState({ openModal: false })}
                >
                  <Text style={styles.textButton}>{I18n.t('no')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.deleteMember()}
                >
                  <Text style={styles.textButton}>{I18n.t('yes')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  deleteMember () {
    const { id, selectedUser, baseUri } = this.state
    let tempData = [...this.state.data]
    let index = tempData.indexOf(selectedUser)
    this.setState({
      loading: true,
      openModal: false
    })
    axios.post(baseUri + '/api/v2/rest/remove_room_participants',
        {
          room_id: id,
          emails: [selectedUser.email]
        }
      ,{
        timeout: 5000,
        headers: {'QISCUS_SDK_SECRET': 'dc0c7e608d9a23c3c8012c6c8572e788'}
      })
      .then((response) => {
        tempData.splice(index, 1)
        this.setState({
          loading: false,
          data: tempData
        })
        console.log('respon: ', response)
      })
      .catch((error) => {
        this.setState({
          loading: false
        })
        console.log('error: ', error)
      })
  }

  render () {
    return (
      <View style={styles.container}>
        <Header
          onLeftPress={() => this.backAndroid()}
          title={I18n.t('roomInfo')}
          isLoading={this.state.loading}
        />
        {this.renderInfoGroup()}
        {this.renderMember()}
        {this.renderModalDelete()}
      </View>
    )
  }
}

export default ProfileGroup
