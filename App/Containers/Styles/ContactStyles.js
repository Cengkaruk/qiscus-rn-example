import { StyleSheet } from 'react-native'
import { Colors } from '../../Themes'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey
  },
  buttonContainer: {
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15
  },
  icon: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
    marginRight: 10
  },
  textName: {
    fontFamily: 'regular',
    fontSize: 14,
    lineHeight: 19,
    color: Colors.darkgrey
  },
  label: {
    marginTop: 24,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 8,
    fontFamily: 'semiBold',
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.5,
    color: Colors.grey
  }
})
