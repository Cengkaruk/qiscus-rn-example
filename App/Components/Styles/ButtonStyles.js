import { StyleSheet } from 'react-native'
import { Colors, Fonts } from '../../Themes'

export default StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  buttonFull: {
    flex: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.green,
    height: 45
  },
  buttonNotFull: {
    height: 45,
    borderRadius: 4,
    paddingRight: 28,
    paddingLeft: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.green
  },
  nextArrow: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    tintColor: Colors.background
  },
  textButton: {
    fontFamily: Fonts.type.semiBold,
    fontSize: 14,
    lineHeight: 19,
    marginRight: 5,
    color: Colors.background
  }
})
