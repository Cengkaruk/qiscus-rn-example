import { StyleSheet, Platform, Dimensions } from 'react-native'
import { Colors, Fonts } from '../../Themes'

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
  iconSearch: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginRight: 10
  },
  textName: {
    fontFamily: Fonts.type.regular,
    fontSize: 14,
    lineHeight: 19,
    color: Colors.darkgrey
  },
  label: {
    marginTop: 24,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 8,
    fontFamily: Fonts.type.semiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.5,
    color: Colors.grey
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
    padding: Platform.OS === 'ios' ? 15 : 10
  },
  input: {
    flex: 1,
    fontFamily: Fonts.type.regular,
    fontSize: 14,
    lineHeight: 25,
    letterSpacing: 0.5,
    color: Colors.grey
  },
  listGroupContainer: {
    height: 70,
    width: Dimensions.get('window').width,
    backgroundColor: Colors.background
  }
})
