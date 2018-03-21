import React from 'react'
import I18n from 'react-native-i18n'
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator
} from 'react-native'
import axios from 'axios'

import { Actions, ActionConst } from 'react-native-router-flux'
import { Images, Dictionary, Colors } from '../Themes'

/**
 * import component
 */
import { Header, ListContact } from '../Components'

import styles from './Styles/ContactStyles'

I18n.translations = Dictionary

class Contact extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      uri: 'https://dashboard-sample.herokuapp.com/api/contacts?limit=10&page=',
      data: [],
      page: 1,
      loadmore: true,
      gettingData: true
    }
  }

  qiscus = this.props.qiscus
  emitter = this.props.emitter

  componentDidMount () {
    this.loadContact()
    this.setState({
      gettingData: false
    })
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
          let loadmore = data < 10 ? false : true
          this.setState({
            data: this.state.data.concat(data),
            loading: false,
            page: page + 1,
            loadmore: loadmore
          })
        })
        .catch(error => console.log(error))
      }
    }
  }

  renderButtonNewGroup () {
    return (
      <TouchableOpacity style={styles.buttonContainer}>
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

  renderitem = ({ item }) => {
    return (
      <ListContact
        name={item.name}
        photo={item.avatar_url}
        onPress={() => this.onPress(item.email)}
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

  onPress (email) {
    qiscus.chatTarget(email)
      .then(result => {
        this.openChat(result)
      }, err => console.log(err))
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

  render () {
    const { loading } = this.state
    return (
      <View style={styles.container}>
        <Header
          title={I18n.t('newConversations')}
        />
        {this.renderButtonNewGroup()}
        <Text style={styles.label}>{I18n.t('contacts')}</Text>
        {this.listContact()}
      </View>
    )
  }
}

export default Contact
