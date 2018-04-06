import { StyleSheet } from 'react-native'
import { Colors, Fonts } from '../../Themes'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    height: 160,
    width: 154,
    resizeMode: 'contain',
    marginBottom: 20
  },
  subtitle: {
    fontFamily: Fonts.type.semiBold,
    fontSize: 18,
    lineHeight: 25,
    marginBottom: 12,
    color: Colors.grey
  },
  description: {
    fontFamily: Fonts.type.regular,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.grey,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop: 40
  }
})
