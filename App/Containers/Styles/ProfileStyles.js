import { StyleSheet, Dimensions } from 'react-native'
import { Colors } from '../../Themes'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey
  },
  photo: {
    height: 200,
    width: Dimensions.get('window').width,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: 10
  },
  icon: {
    height: 24,
    width: 24,
    resizeMode: 'contain'
  },
  infoContainer: {
    flexDirection: 'column'
  },
  textLabel: {
    marginTop: 24,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 10,
    fontFamily: 'semiBold',
    letterSpacing: 0.5,
    fontSize: 11,
    lineHeight: 14,
    color: Colors.grey
  },
  idContainer: {
    backgroundColor: Colors.background,
    flexDirection: 'column',
    padding: 15
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textData: {
    flex: 1,
    marginLeft: 14,
    fontFamily: 'regular',
    fontSize: 14,
    lineHeight: 19,
    color: Colors.darkgrey
  },
  logoutContainer: {
    marginTop: 46,
    backgroundColor: Colors.background,
    flex: 1,
    padding: 15
  }
})
