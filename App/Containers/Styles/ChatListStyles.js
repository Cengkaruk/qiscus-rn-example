import { StyleSheet, Dimensions } from 'react-native'
import { Colors } from '../../Themes'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey
  },
  dateContainer: {
    position: 'absolute',
    zIndex: 99,
    top: 64,
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center'
  },
  date: {
    backgroundColor: Colors.greyBackground,
    padding: 3,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12
  },
  textDate: {
    fontFamily: 'regular',
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.5,
    color: Colors.grey
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
    fontFamily: 'regular',
    fontSize: 14,
    lineHeight: 25,
    letterSpacing: 0.5,
    color: Colors.grey
  }
})
