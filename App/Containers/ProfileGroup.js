import React from 'react'
import I18n from 'react-native-i18n'
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  ScrollView
} from 'react-native'

import { Images, Dictionary, Colors } from '../Themes'

/**
 * import component
 */
import { Header, ListMember} from '../Components'

import styles from './Styles/ProfileGroupStyles'

I18n.translations = Dictionary

class ProfileGroup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: this.props.data,
      dataGroup: this.props.dataGroup
    }
  }

  qiscus = this.props.qiscus
  emitter = this.props.emitter

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
        photo={item.avatar_urn}
        name={item.username}
        onPress={() => this.deleteMember(item.email)}
      />
    )
  }

  deleteMember (email) {
    // console.log(email)
  }

  render () {
    return (
      <View style={styles.container}>
        <Header title={I18n.t('roomInfo')} />
        {this.renderInfoGroup()}
        {this.renderMember()}
      </View>
    )
  }
}

export default ProfileGroup
