import { StyleSheet } from 'react-native'
import { Colors } from '../../Themes'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  imageBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 65,
    marginBottom: 20
  },
  logo: {
    resizeMode: 'contain',
    width: 170,
    height: 56
  },
  separator: {
    marginTop: 20
  },
  buttonContainer: {
    marginTop: 50
  },
  scrollViewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  }
})
