import React from 'react'
import {
  Scene,
  Router,
  Stack
} from 'react-native-router-flux'

/**
 * We can register all the containers in our apps in the navigator by importing them
 * and add them to the scene navigation
 */

import Login from '../Containers/Login'
import ChatList from '../Containers/ChatList'
import ChatRoom from '../Containers/ChatRoom'
import Media from '../Containers/Media'
import Profile from '../Containers/Profile'
import Contact from '../Containers/Contact'
import App from '../Containers/App'

/**
 * key is the variable we used to call the container (can be pop, push, reset, etc)
 * title shown in the middle of the header
 * component is the where we set the container
 * hideNavBar always set to true because we set the header in the container itself to make it more dynamic
 */

const Navigation = () => (
  <Router>
    <Stack
      hideNavBar={false}
      key='root'
      titleStyle={{ alignSelf: 'center' }}
    >
      <Scene
        key='login'
        title=''
        hideNavBar
        component={Login}
      />
      <Scene
        key='chatlist'
        title=''
        hideNavBar
        component={ChatList}
      />
      <Scene
        key='chatroom'
        title=''
        hideNavBar
        component={ChatRoom}
      />
      <Scene
        key='media'
        title=''
        hideNavBar
        component={Media}
      />
      <Scene
        key='profile'
        title=''
        hideNavBar
        component={Profile}
      />
      <Scene
        key='contact'
        title=''
        hideNavBar
        component={Contact}
      />
      <Scene
        key='app'
        title='CustomNavBar 2'
        hideNavBar
        component={App}
      />
    </Stack>
  </Router>
)

export default Navigation
