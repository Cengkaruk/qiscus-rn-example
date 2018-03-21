import { StyleSheet } from 'react-native'
import { Colors } from '../../Themes'

export default StyleSheet.create({
  container: {
    height: 56,
    padding: 10,
    paddingBottom: 0,
    paddingTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1
  },
  leftContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageLeft: {
    width: 24,
    height: 24,
    resizeMode: 'contain'
  },
  titleContainer: {
    flex: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textTitle: {
    fontFamily: 'semiBold',
    fontSize: 18,
    lineHeight: 25
  },
  textOnline: {
    fontFamily: 'regular',
    fontSize: 12,
    lineHeight: 15,
    color: Colors.green
  },
  textSubtitle: {
    fontFamily: 'regular',
    fontSize: 12,
    lineHeight: 15,
    color: Colors.label
  }
})
