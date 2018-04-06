import { StyleSheet, Dimensions } from 'react-native'
import { Colors, Fonts } from '../../Themes'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: Dimensions.get('window').width,
    height: 200,
    resizeMode: 'cover'
  },
  inputContainer: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderTopColor: Colors.border,
    borderTopWidth: 1
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    padding: 5
  },
  imageButton: {
    height: 24,
    width: 24,
    resizeMode: 'contain'
  },
  input: {
    flex: 1,
    fontFamily: Fonts.type.regular,
    fontSize: 14,
    lineHeight: 25,
    letterSpacing: 0.5,
    color: Colors.grey
  }
})
