import { StyleSheet, Dimensions } from 'react-native'
import { Colors } from '../../Themes'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey
  },
  infoContainer: {
    backgroundColor: Colors.background,
    flexDirection: 'row',
    padding: 16
  },
  photo: {
    height: 64,
    width: 64,
    borderRadius: 32,
    resizeMode: 'contain'
  },
  nameContainer: {
    flexDirection: 'column',
    flex: 1,
    marginTop: 5
  },
  labelName: {
    fontFamily: 'semiBold',
    fontSize: 11,
    lineHeight: 14,
    marginBottom: 5,
    letterSpacing: 0.5,
    color: Colors.label
  },
  inputContainer: {
    flexDirection: 'row',
    borderBottomColor: Colors.grey,
    borderBottomWidth: 1
  },
  input: {
    flex: 1,
    fontFamily: 'regular',
    color: Colors.darkgrey,
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0.2
  },
  participantsContainer: {
    marginTop: 24,
    flexDirection: 'column'
  },
  label: {
    fontFamily: 'semiBold',
    fontSize: 11,
    lineHeight: 14,
    color: Colors.grey,
    marginBottom: 10,
    marginLeft: 16
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
  }
})
