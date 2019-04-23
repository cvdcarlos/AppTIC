// In App.js in a new project

import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";

import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import Homenotif from './screens/Homenotif'

class App extends React.Component {
  render() {
    return (
      <AppNavigator/>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Login: LoginScreen,
    Homenotif: Homenotif,
    
    
  },
  {
    initialRouteName: "Login"
  }
);

export default createAppContainer(AppNavigator);