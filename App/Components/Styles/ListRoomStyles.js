import { StyleSheet, Platform } from 'react-native'
import { Colors, Fonts } from '../../Themes'

export default StyleSheet.create({
  itemContainer: {
    padding: 15,
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'center'
  },
  photo: {
    height: 40,
    width: 40,
    marginBottom: 15,
    borderRadius: Platform.OS === 'ios' ? 20 : 160
  },
  item: {
    flexDirection: 'row',
    flex: 1,
    paddingBottom: 15,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
    marginLeft: 15
  },
  textName: {
    fontFamily: Fonts.type.regular,
    fontSize: 14,
    lineHeight: 19,
    color: Colors.black
  },
  textMessage: {
    fontFamily: Fonts.type.regular,
    fontSize: 11,
    lineHeight: 15,
    color: Colors.label
  },
  unreadContainer: {
    marginTop: 3,
    backgroundColor: Colors.green,
    minWidth: 18,
    minHeight: 18,
    borderRadius: 9,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textUnread: {
    fontFamily: Fonts.type.regular,
    fontSize: 11,
    lineHeight: 14,
    color: Colors.background
  }
})
