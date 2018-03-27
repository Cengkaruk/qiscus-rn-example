import React from 'react'
import I18n from 'react-native-i18n'
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  BackHandler,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import axios from 'axios'

import { Actions, ActionConst } from 'react-native-router-flux'
import { Images, Dictionary, Colors } from '../Themes'

/**
 * import component
 */
import { Header, ListContact, ListGroup } from '../Components'

import styles from './Styles/ContactStyles'

I18n.translations = Dictionary

class Contact extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      uri: 'https://dashboard-sample.herokuapp.com/api/contacts?limit=10&page=',
      data: [],
      dataGroup: [],
      page: 1,
      loadmore: true,
      gettingData: true,
      isCreatingGroup: false,
      searchContact: ''
    }
  }

  qiscus = this.props.qiscus
  emitter = this.props.emitter

  componentDidMount () {
    this.loadContact()
    this.setState({
      gettingData: false
    })
    BackHandler.addEventListener('hardwareBackPress', () => this.backAndroid())
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', () => this.backAndroid())
  }

  backAndroid () {
    const { isCreatingGroup } = this.state
    if (isCreatingGroup) {
      this.setState({
        isCreatingGroup: false
      })
    } else {
      Actions.pop()
    }
    return true // to prevent apps to exit
  }

  async loadContact () {
    const { uri, page, loadmore, loading, gettingData } = this.state
    if (!loading || gettingData) {
      if (loadmore) {
        this.setState({
          loading: true
        })
        await axios.get(uri + page)
        .then(response => {
          let data = response.data.results.users
          let tempData = []
          for (let i = 0; i < data.length; i++) {
            data[i].isChecking = false
          }
          tempData = [...data]
          let loadmore = data < 10 ? false : true
          this.setState({
            data: this.state.data.concat(tempData),
            loading: false,
            page: page + 1,
            loadmore: loadmore
          })
        })
        .catch(error => console.log(error))
      }
    }
  }

  renderSearch () {
    const { isCreatingGroup, searchContact } = this.state
    if (isCreatingGroup) {
      return (
        <View style={styles.searchContainer}>
          <Image style={styles.iconSearch} source={Images.searchContact} />
          <TextInput
            placeholder={I18n.t('search')}
            underlineColorAndroid='transparent'
            style={styles.input}
            value={searchContact}
            onChangeText={(text) => {
              this.setState({ searchContact: text })}
            }
            autoCapitalize='none'
            autoCorrect={false}
          />
        </View>
      )
    }
    return null
  }

  renderButtonNewGroup () {
    const { isCreatingGroup } = this.state
    if (isCreatingGroup) return null
    return (
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => this.setState({ isCreatingGroup: true })
      }>
        <Image source={Images.group} style={styles.icon} />
        <Text style={styles.textName}>{I18n.t('createGroupChat')}</Text>
      </TouchableOpacity>
    )
  }

  listContact () {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <FlatList
          data={this.state.data}
          renderItem={this.renderitem}
          keyExtractor={item => item.id}
          onEndReached={() => this.loadContact()}
          onEndReachedThreshold={0.9}
          ListFooterComponent={this.renderFooter()}
        />
      </View>
    )
  }

  renderGroup () {
    const { dataGroup, isCreatingGroup } = this.state
    if (isCreatingGroup) {
      if (dataGroup.length > 0) {
        return (
          <View style={styles.listGroupContainer}>
            <FlatList
              data={dataGroup}
              renderItem={this.renderitemGroup}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )
      } return null
    }
    return null
  }

  renderitem = ({ item, index }) => {
    const { isCreatingGroup } = this.state
    return (
      <ListContact
        name={item.name}
        photo={item.avatar_url}
        onPress={() => this.onPress(item.email, index)}
        isChecking={item.isChecking}
        isCreatingGroup={isCreatingGroup}
        type='add'
      />
    )
  }

  renderitemGroup = ({ item, index }) => {
    return (
      <ListGroup
        name={item.name}
        photo={item.avatar_url}
        onPress={() => this.removeMember(index)}
      />
    )
  }

  renderFooter () {
    const { loading } = this.state
    if (loading) {
      return (
        <View style={{ padding: 10 }}>
          <ActivityIndicator size='small' color={Colors.green} />
        </View>
      )
    }
  }

  onPress (email, index) {
    const { isCreatingGroup, data, dataGroup } = this.state
    if (isCreatingGroup) {
      let tempData = [...data]
      let tempDataGroup = [...dataGroup]
      let indexMember
      if (tempData[index].isChecking) {
        tempData[index].isChecking = false
        indexMember = tempDataGroup.indexOf(tempData[index])
        tempDataGroup.splice(indexMember, 1)
        this.setState({
          data: tempData,
          dataGroup: tempDataGroup
        })
      } else {
        tempData[index].isChecking = true
        tempDataGroup.push(tempData[index])
        this.setState({
          data: tempData,
          dataGroup: tempDataGroup
        })
      }
    } else {
      qiscus.chatTarget(email)
      .then(result => {
        this.openChat(result)
      }, err => console.log(err))
    }
  }

  removeMember (index) {
    const { dataGroup } = this.state
    let tempDataGroup = [...dataGroup]
    tempDataGroup.splice(index, 1)
    this.setState({
      dataGroup: tempDataGroup
    })
  }

  async openChat (result) {
    let currentUser = await qiscus.userData
    const index = result.participants[0].email === currentUser.email ? 1 : 0
    Actions.chatlist({
      type: ActionConst.PUSH,
      id: String(result.id),
      roomName: result.participants[index].username,
      email: currentUser.email,
      typeRoom: result.room_type,
      qiscus: qiscus,
      emitter: this.emitter
    })
  }

  createGroup () {
    const { dataGroup } = this.state
    if (dataGroup.length > 0) {
      Actions.creategroup({
        type: ActionConst.PUSH,
        data: dataGroup,
        emitter: this.emitter,
        qiscus: this.qiscus
      })
    }
  }

  /**
   * adding keyboard avoiding view if the platform is ios
   */

  render () {
    const { loading, isCreatingGroup } = this.state
    let content = (
      <View style={{ flex: 1 }} >
        {/* {this.renderSearch()} */}
        {this.renderGroup()}
        {this.renderButtonNewGroup()}
        <Text style={styles.label}>{I18n.t('contacts')}</Text>
        {this.listContact()}
      </View>
    )
    let view
    if (Platform.OS === 'ios') {
      view = (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>
          {content}
        </KeyboardAvoidingView>
      )
    } else { // for android
      view = content
    }
    return (
      <View style={styles.container}>
        <Header
          onLeftPress={() => this.backAndroid()}
          title={isCreatingGroup ? I18n.t('chooseContacts') : I18n.t('newConversations')}
          showRightButton={isCreatingGroup}
          rightButtonImage={Images.nextArrow}
          onRightPress={() => this.createGroup()}
        />
        {view}
      </View>
    )
  }
}

export default Contact
