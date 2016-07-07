import React, { Component } from 'react';
import {
  View,
  Text,
  Navigator,
  StyleSheet
} from 'react-native';

import SplashComponent from './components/SplashComponent'

class AppNav extends Component {

  render(){
    return (
      <Navigator
        initialRoute={{
          name: 'Splash',
          Component : SplashComponent
        }}
        configureScene={ (route, routeStack) => Navigator.SceneConfigs.PushFromRight }
        renderScene={(route, navigator) => {
          let Component = route.Component
          return <Component {...route.params} navigator={navigator} />

        }}

        />
    );
  }


}


export default AppNav
