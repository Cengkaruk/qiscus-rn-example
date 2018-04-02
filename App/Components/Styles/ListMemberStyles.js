import { StyleSheet } from 'react-native'
import { Colors } from '../../Themes'

export default StyleSheet.create({
  itemContainer: {
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingRight: 15
  },
  photo: {
    height: 30,
    width: 30,
    marginTop: -5
  },
  item: {
    flexDirection: 'row',
    flex: 1,
    marginLeft: 15,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1
  },
  textName: {
    fontFamily: 'regular',
    fontSize: 14,
    lineHeight: 19,
    color: Colors.black
  },
  icon: {
    height: 24,
    width: 24,
    resizeMode: 'contain'
  }
})
