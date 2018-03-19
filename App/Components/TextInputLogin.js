import React from 'react'
import { TextInput, View, Text } from 'react-native'
import { Colors } from '../Themes'
import PropTypes from 'prop-types'

import styles from './Styles/TextInputStyles'

export default class TextInputLogin extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      label: this.props.label,
      error: this.props.errorState,
      stateInput: 0, // 0 for default, 1 for focus
      secureTextEntry: this.props.secureTextEntry
    }
  }

  /**
   * propTypes is used to set the data type and default value
   */

  static propTypes = {
    label: PropTypes.string,
    error: PropTypes.bool,
    keyboardType: PropTypes.string,
    onChangeText: PropTypes.func,
    secureTextEntry: PropTypes.bool
  }

  static defaultProps = {
    label: '',
    error: false,
    keyboardType: 'default',
    secureTextEntry: false
  }

  onFocus () {
    this.setState({
      stateInput: 1
    })
  }

  onBlur () {
    this.setState({
      stateInput: 0
    })
  }

  render () {
    const { label, stateInput, error, secureTextEntry } = this.state
    let color
    if (error) {
      color = Colors.red
    } else {
      switch (stateInput) {
        case 0:
          color = Colors.grey
          break
        case 1:
          color = Colors.green
          break
        default:
          color = Colors.grey
          break
      }
    }
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.container}>
          <Text style={styles.label}>
            {label}
          </Text>
          <View style={[styles.inputContainer, { borderBottomColor: color }]}>
            <TextInput
              ref={label}
              placeholder={label}
              secureTextEntry={secureTextEntry}
              underlineColorAndroid='transparent'
              style={styles.input}
              onFocus={() => this.onFocus()}
              onBlur={() => this.onBlur()}
              value={this.props.value}
              onChangeText={this.props.onChangeText}
              autoCapitalize='none'
              autoCorrect={false}
            />
          </View>
        </View>
      </View>
    )
  }
}
