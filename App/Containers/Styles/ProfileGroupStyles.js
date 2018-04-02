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
  },
  modalContainer: {
    backgroundColor: Colors.backgroundModal,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  warningContainer: {
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 20,
    maxWidth: 300,
    flexDirection: 'column'
  },
  warning: {
    fontFamily: 'regular',
    color: Colors.darkgrey,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24
  },
  textButton: {
    fontFamily: 'semiBold',
    color: Colors.background,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25
  },
  button: {
    height: 36,
    flex: 1,
    margin: 8,
    borderRadius: 4,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemContainer: {
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingRight: 15
  },
  iconAdd: {
    marginTop: -5,
    height: 30,
    width: 30,
    resizeMode: 'contain'
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
  }
})
