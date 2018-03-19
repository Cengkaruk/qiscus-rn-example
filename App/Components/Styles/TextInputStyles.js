import { StyleSheet } from 'react-native'
import { Colors } from '../../Themes'

export default StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1
  },
  label: {
    fontFamily: 'semiBold',
    fontSize: 14,
    lineHeight: 14,
    letterSpacing: 0.5,
    color: Colors.label
  },
  inputContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginTop: 5
  },
  input: {
    flex: 1,
    fontFamily: 'regular',
    color: Colors.grey,
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0.2
  }
})
