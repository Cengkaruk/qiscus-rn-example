import { StyleSheet, Dimensions } from 'react-native'
import { Colors } from '../../Themes'

export default StyleSheet.create({
  senderContainer: {
    flexDirection: 'row'
  },
  statusContainer: {
    flexDirection: 'column',
    marginTop: 10
  },
  textDate: {
    fontFamily: 'regular',
    fontSize: 12,
    lineHeight: 14,
    color: Colors.label
  },
  messageContainer: {
    maxWidth: Dimensions.get('window').width * 2 / 3,
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 8,
    elevation: 2,
    margin: 3
  },
  textMessage: {
    fontFamily: 'regular',
    fontSize: 14,
    lineHeight: 23,
    color: Colors.grey
  },
  name: {
    fontFamily: 'semiBold',
    fontSize: 12,
    marginLeft: 4,
    lineHeight: 14,
    color: Colors.grey
  },
  photo: {
    height: 30,
    width: 30,
    borderRadius: 15,
    marginRight: 10,
    marginTop: 20
  },
  statusRead: {
    height: 12,
    width: 16,
    resizeMode: 'contain'
  },
  statusDelivered: {
    height: 9,
    width: 12,
    resizeMode: 'contain'
  },
  statusPending: {
    height: 12,
    width: 12,
    resizeMode: 'contain'
  },
  imageStatusContainer: {
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    marginTop: 2,
    flexDirection: 'row'
  },
  statusFailed: {
    height: 9,
    width: 12,
    resizeMode: 'contain'
  },
  textFailed: {
    fontFamily: 'regular',
    fontSize: 12,
    lineHeight: 15,
    color: Colors.red
  },
  imageMessage: {
    minHeight: 0.20 * Dimensions.get('window').height,
    minWidth: 0.45 * Dimensions.get('window').width,
    margin: -4
  },
  payloadContainer: {
    flexDirection: 'row',
    borderTopColor: Colors.border,
    borderRightColor: Colors.border,
    borderBottomColor: Colors.border,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3
  },
  greenBar: {
    width: 5,
    backgroundColor: Colors.green,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3
  },
  textReplyContainer: {
    flexDirection: 'column',
    padding: 5,
    paddingLeft: 10
  },
  replied: {
    fontFamily: 'regular',
    fontSize: 11,
    lineHeight: 19
  }
})
