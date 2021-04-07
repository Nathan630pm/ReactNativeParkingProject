import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, LogBox } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AddParkingScreen from './AddParkingScreen';
import ProfileScreen from './ProfileScreen';
import ViewParkingScreen from './ViewParkingScreen';

import {Database} from './Database'


const Tab = createBottomTabNavigator();


  LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
  LogBox.ignoreAllLogs();//Ignore all log notifications




export default function MainTabs({navigation, route}) {


const test = "test!"

  // const [data, setData] = useState([])

  const {data} = route.params;

  

  // useEffect(() => {
  
  //   (async () => {
      
  //     Database.getData(setData)
  // console.log("Data: ");
  // console.log(data);

  //   })();
  // }, []);
  
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
          },
          params: {test: "test"}
          
        })
        
        }
        tabBarOptions={{
          activeTintColor: "blue",
          inactiveTintColor: "#AFAFAF",
        }}
        options={{test: "test"}}
        >
          <Tab.Screen 
            name="View Parking" 
            children={()=><ViewParkingScreen data={data} navigation={navigation}/>}
            
          />

          <Tab.Screen 
            name="Add Parking" 
            children={()=><AddParkingScreen data={data} navigation={navigation}/>}
          />

          <Tab.Screen 
            name="Profile" 
            children={()=><ProfileScreen data={data} navigation={navigation}/>}
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
