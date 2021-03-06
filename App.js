import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MainTabs from './src/MainTabs'
import LoginScreen from './src/LoginScreen'
import RegisterScreen from './src/RegisterScreen'
import ParkingDetails from './src/ParkingDetailsScreen'
import ParkingMap from './src/MapScreen'

const Stack = createStackNavigator();

export default function App() {

  const MyTheme = {
    dark: true,
    colors: {
      primary: 'blue',
      background: '#333',
      card: '#00A800',
      text: 'white',
      border: 'orange',
      notification: 'red',
    },
  };


  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        initialRouteName="Login" 
      >

        <Stack.Screen 
          name="Login" component={LoginScreen}
          options={ ({navigation}) => {}}
        />

        <Stack.Screen 
          name="Register" component={RegisterScreen}
          options={ ({navigation}) => {}}
        />

        <Stack.Screen 
          name="Parking" component={MainTabs}
          options={ ({route}) => ({}), ({navigation}) => ({headerRight: () => (
          <TouchableOpacity style={styles.TouchableOpacity} onPress={() => navigation.replace('Login')}>
            <Text style={styles.TOText}>Logout</Text>
          </TouchableOpacity>
        )})}
        />

        <Stack.Screen 
          name="Parking Detials" component={ParkingDetails}
          options={ ({navigation}) => {}, ({route}) => ({})}
        />

        <Stack.Screen 
          name="Parking Map" component={ParkingMap}
          options={ ({navigation}) => {}, ({route}) => ({})}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  TouchableOpacity: {
    width: '100%',
    padding: 10,
    backgroundColor: "darkgreen",
    color: 'white',
    marginRight: 10,
    margin: 2
  },
  TOText: {
    fontSize: 10,
    color: 'white',
    textAlign: "center",
  }
});