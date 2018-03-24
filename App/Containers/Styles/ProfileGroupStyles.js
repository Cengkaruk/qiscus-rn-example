import { StyleSheet, Dimensions } from 'react-native'
import { Colors } from '../../Themes'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey
  },
  photo: {
    height: 200,
    width: Dimensions.get('window').width,
    flexDirection: 'column',
    padding: 10
  },
  dataContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  name: {
    flex: 1,
    fontFamily: 'semiBold',
    fontSize: 18,
    lineHeight: 28,
    marginLeft: 10,
    color: Colors.background
  },
  icon: {
    height: 24,
    width: 24,
    resizeMode: 'contain'
  },
  memberContainer: {
    flexDirection: 'column',
    flex: 1
  },
  label: {
    fontFamily: 'semiBold',
    fontSize: 11,
    lineHeight: 14,
    marginLeft: 16,
    marginTop: 24,
    marginBottom: 10,
    marginRight: 16,
    color: Colors.grey
  }
})
