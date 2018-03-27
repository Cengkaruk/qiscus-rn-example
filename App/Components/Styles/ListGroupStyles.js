import { StyleSheet } from 'react-native'
import { Colors } from '../../Themes'

export default StyleSheet.create({
  itemContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    width: 80,
    paddingRight: 10
  },
  photo: {
    height: 40,
    width: 40
  },
  iconDelete: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    position: 'absolute',
    right: 15,
    zIndex: 10,
    top: 10
  },
  textName: {
    fontFamily: 'regular',
    fontSize: 14,
    lineHeight: 19,
    color: Colors.black
  }
})
