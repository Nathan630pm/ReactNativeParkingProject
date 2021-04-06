import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform, SafeAreaView, ScrollView, PermissionsAndroid } from 'react-native';

import Checkbox from './Checkbox'

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import Firebase from './FirebaseConfig';
import 'firebase/firestore';

import {Database} from './Database'

export default function AddParkingScreen({route, navigation, data}) {

  

  const [name, setName] = useState('')
  const [plateNo, setPlateNo] = useState('')
  const [location, setLocation] = useState('')
  const [bday, setBday] = useState('')
  const [number, setNumber] = useState('')
  const [food, setFood] = useState('')
  const [userLocation, setUserLocation] = useState('')
  // const [data, setData] = useState([])

  const [isLoading, setIsLoading] = useState(true)


  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [checked, setChecked] = useState(false)

  if(plateNo == '' && data.length != 0){
    console.log("setting data");
    setPlateNo(data[0].carPlateNumber)
    console.log("plate no:", plateNo);
  }
  
  
  


  
useEffect(() => {
  
    (async () => {
      
      // let { status } = await Location.requestPermissionsAsync();
      let { status } = await Permissions.askAsync(Permissions.LOCATION)
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }
      console.log("aye, I got permissions! :D");
      let location = await Location.getCurrentPositionAsync({});
            
      getGeoAddr(location.coords)
    })();
  }, []);

  

  const getGeoAddr = async (loc) => {
    
    console.log(loc);

    if(loc == null) {
      return;
    }

    let reverseCode = await Location.reverseGeocodeAsync({
      latitude: loc.latitude,
      longitude: loc.longitude
    })

    console.log("User Address:");
    console.log(reverseCode);
    setUserLocation(reverseCode[0].name + " " + reverseCode[0].city + " " + reverseCode[0].region + " " + reverseCode[0].country)
    setIsLoading(false)

  }

  const geocode = async () => {
    let geoCode = await Location.geocodeAsync("58 hammell blvd tottenham ontario")
    console.log("User Location in Coords: ");
    console.log(geoCode == [] ? geoCode : "Not found.");
  }


  const addFriend = () => {
    console.log("adding friend...");

  }


  return (



    <SafeAreaView style={styles.container}>
    
    {isLoading == true ?
        <View style={styles.AILoading}>
          <ActivityIndicator size="large" color={Platform.OS === 'ios' ? "grey" : "#00a800"} />
          <Text style={{color: "#afafaf"}}>Setting Up Form...</Text>
        </View> :
        <View>
      <ScrollView>
        <Text style={styles.InputTitle}>Building Code (5 Characters)</Text>
        <TextInput 
        style={styles.input}
        placeholder = "Friend Name"
        placeholderTextColor = "gray"
        returnKeyType = "next"
        value = {name}
        onChangeText = {setName}
        textContentType = "name"
        autoCapitalize="none"
        />
        <Text style={styles.InputTitle}>Car Plate Number (2-8 Characters)</Text>
        <TextInput 
          style={styles.input}
          placeholder = "Plate Number"
          placeholderTextColor = "gray"
          returnKeyType = "next"
          value = {plateNo}
          onChangeText = {setPlateNo}
          textContentType = "nickname"
          autoCapitalize="none"
        />
        <Text style={styles.InputTitle}>Parking Location</Text>
        <View style={styles.checkboxView}>
          <Checkbox isChecked={checked} setChecked={setChecked}/>
        </View>
        <TextInput 
          style={checked ? styles.inputDisabled : styles.input}
          placeholder = "Parking Location"
          placeholderTextColor = "gray"
          returnKeyType = "next"
          value = {checked ? userLocation : location}
          onChangeText = {checked ? setUserLocation : setLocation}
          textContentType = "emailAddress"
          autoCapitalize="none"
          editable={checked ? false : true}
        />
        <Text style={styles.InputTitle}>Date</Text>
        
      </ScrollView>
      <View style={styles.addFriend}>
        <TouchableOpacity onPress={addFriend}>
          <Text style={styles.button}>Add Friend</Text>
        </TouchableOpacity>
      </View>
      </View>
      }
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input:{
    height: 40,
    margin: 12,
    paddingHorizontal: 10,
    borderColor : 'gray',
    borderWidth: 1,
    backgroundColor: 'white',
    color: 'black',
  },
  inputDisabled: {
    height: 40,
    margin: 12,
    paddingHorizontal: 10,
    borderColor : 'gray',
    borderWidth: 1,
    backgroundColor: '#afafaf',
    color: 'black'
  },
  addFriend: {
    alignItems: 'center'
  },
  button: {
    padding: 10,
    margin: 10,
    backgroundColor: "#00A800",
    color: 'white'
  },
  InputTitle: {
    color: "#afafaf",
    paddingTop: 5,
    paddingHorizontal: 10,
  },
  checkboxView: {
    color: "#afafaf",
    paddingHorizontal: 10,
  },
  AILoading: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  
});
