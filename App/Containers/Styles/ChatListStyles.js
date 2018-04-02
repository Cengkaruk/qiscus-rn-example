import { StyleSheet, Dimensions, Platform } from 'react-native'
import { Colors } from '../../Themes'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey
  },
  dateContainer: {
    position: 'absolute',
    zIndex: 99,
    top: Platform.OS === 'ios' ? 84 : 64,
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
  },
  modalContainer: {
    backgroundColor: Colors.backgroundModal,
    flex: 1,
    flexDirection: 'column'
  },
  optionContainer: {
    width: Dimensions.get('window').width,
    backgroundColor: Colors.lightGrey,
    flexDirection: 'column'
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15
  },
  iconMenu: {
    height: 24,
    width: 24,
    marginRight: 15,
    resizeMode: 'contain'
  },
  textMenu: {
    fontFamily: 'regular',
    fontSize: 16,
    lineHeight: 19,
    color: Colors.darkgrey
  },
  border: {
    height: 1,
    marginLeft: 15,
    marginRight: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.border
  },
  replyContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    alignItems: 'center',
    minHeight: 50,
    maxHeight: 100,
    width: Dimensions.get('window').width
  },
  greenBar: {
    minHeight: 50,
    flex: 1,
    width: 5,
    backgroundColor: Colors.green
  },
  contentReplyContainer: {
    flexDirection: 'column',
    marginLeft: 8,
    padding: 2
  },
  textName: {
    fontFamily: 'semiBold',
    fontSize: 12,
    lineHeight: 18,
    color: Colors.grey
  },
  textMessage: {
    fontFamily: 'regular',
    fontSize: 14,
    lineHeight: 23,
    color: Colors.grey
  },
  cancelContainer: {
    flexDirection: 'column'
  },
  cancel: {
    width: 16,
    height: 16,
    resizeMode: 'contain'
  },
  imageMessage: {
    width: 33,
    height: 33,
    resizeMode: 'cover',
    borderRadius: 4
  }
})
