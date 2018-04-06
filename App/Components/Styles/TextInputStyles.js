import { StyleSheet, Platform } from 'react-native'
import { Colors, Fonts } from '../../Themes'

export default StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1
  },
  label: {
    fontFamily: Fonts.type.semiBold,
    fontSize: 14,
    lineHeight: 14,
    letterSpacing: 0.5,
    color: Colors.label
  },
  inputContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginTop: Platform.OS === 'ios' ? 10 : 0,
    marginBottom: Platform.OS === 'ios' ? 10 : 0
  },
  input: {
    flex: 1,
    fontFamily: Fonts.type.regular,
    color: Colors.grey,
    fontSize: 14,
    lineHeight: 19,
    marginBottom: Platform.OS === 'ios' ? 5 : -10,
    letterSpacing: 0.2
  }
})
