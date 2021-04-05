import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AddParkingScreen from './AddParkingScreen';
import ProfileScreen from './ProfileScreen';
import ViewParkingScreen from './ViewParkingScreen';


const Tab = createBottomTabNavigator();


 




export default function MainTabs({navigation, route}) {
  return (
    <Tab.Navigator
        screenOptions={ ({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if(route.name === "View Parking"){
              iconName = focused ? 'list-circle' : 'list-circle-outline';
            } else if(route.name === "Add Parking") {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } else if(route.name === "Profile") {
              iconName = focused ? 'person-circle' : 'person-circle-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />
          }
        })
        }
        tabBarOptions={{
          activeTintColor: "blue",
          inactiveTintColor: "#AFAFAF",
        }
        }
        >
          <Tab.Screen 
            name="View Parking" 
            component={ViewParkingScreen}
          />

          <Tab.Screen 
            name="Add Parking" 
            component={AddParkingScreen}
          />

          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen}
          />
        </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
