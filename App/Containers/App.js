import React, { Component } from 'react';
import { 
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';
import qiscus from '../../libs/SDKCore';
import RoomList from '../../components/RoomList';
import ChatPanel from '../../components/ChatPanel';
//  import Renderer from './chatRenderer';
//  import {InitApp} from 'react-native-qiscus-sdk'
// const qiscus = new QiscusSDK();

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      activeRoom: null,
      activeComments: [],
      rooms: [],
      activePage: 'rooms',
      isLogin: false,
      curRoomId: null,
      mylog: 0,
    };
  }
  componentWillMount() {
    const userAuth = {
      email: 'fikri@qiscus.com',
      password: 'password',
      displayName: 'Fikri',
      avatar: null,
    }
    qiscus.init({
      AppId: 'sampleapp-65ghcsaysse',
      options: {
        loginSuccessCallback: this.loadRoomList.bind(this),
        newMessagesCallback: (comments) => {
          this.setState({mylog: comments[0].message});
          setTimeout(() => this.setState({ activeComments: qiscus.selected.comments }), 0);
        },
        typingCallback: (typing) => this.setState({mylog: JSON.stringify(typing)})
      }
    });
    qiscus.setUser(userAuth.email, userAuth.password, userAuth.displayName, userAuth.avatar);
  }

  loadRoomList() {
    this.setState({isLogin: true});
    qiscus.userAdapter.loadRoomList().then(data => this.setState({rooms: data}));
  }

  updateActiveComments(comments) {
    this.setState({
      mylog: this.state.mylog + 1,
      activeComments: qiscus.selected.comments,
    });
  }

  openChat(roomId) {
    // console.log('isi qiscus', qiscus);
    // qiscus.chatGroup(roomId).then(() => {
    this.setState({
      // activeRoom: qiscus.selected,
      // activeComments: qiscus.selected.comments,
      activePage: 'comments',
      curRoomId: roomId,
    });
    // });
  }

  render() {
    // if user is not logged in yet, render this text
    if (!this.state.isLogin) {
      return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40}}>
        <Text>Initializing App...</Text>
      </View>;
    }

    // display room list or comment list
    if (this.state.activePage == 'rooms') {
      // display room list
      return <View style={styles.container}><RoomList rooms={this.state.rooms} openChat={this.openChat.bind(this)} /></View>
    } else {
      // display comment list
      return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <TouchableOpacity style={{
            margin: 10, justifyContent: 'center', 
            alignItems: 'center', height: 40, width: 80, 
            borderWidth: 1, borderColor: '#333131',
            borderRadius: 20
          }} onPress={() => this.setState({activePage: 'rooms'})}>
            <Text>Back</Text>
          </TouchableOpacity>
          <ChatPanel roomId={this.state.curRoomId}
            activeComments={this.state.activeComments}
            updateActiveComments={this.updateActiveComments.bind(this)} />
        </KeyboardAvoidingView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    marginTop: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  containerRow: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#dce2e9',
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  button: {
    marginLeft: 30,
    marginBottom: 10,
    marginTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 80,
    borderWidth: 1,
    borderColor: '#333131',
  },
});
