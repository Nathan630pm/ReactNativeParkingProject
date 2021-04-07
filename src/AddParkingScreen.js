import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform, SafeAreaView, ScrollView, PermissionsAndroid } from 'react-native';

import Checkbox from './Checkbox'

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import Firebase from './FirebaseConfig';
import 'firebase/firestore';

import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-datepicker';



import {Database} from './Database'

export default function AddParkingScreen({route, navigation, data}) {

  

  const [buildingCode, setBuildingCode] = useState('12345')
  const [plateNo, setPlateNo] = useState('')
  const [plateSet, setPlateSet] = useState(false)
  const [suit, setSuit] = useState('58')
  const [location, setLocation] = useState('')
  const [userLocation, setUserLocation] = useState('')

  const [coords, setCoords] = useState({latitude: 0, longitude: 0})
  const [foundCoords, setFoundCoords] = useState(null)

  const [time, setTime] = useState(0)
  const [value, setValue] = useState("")

  const hours = [
    "1 Hour or less",
    "4-Hour",
    "12-Hour",
    "24-Hour"
  ]

  
  var day = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();
  const today = new Date();
  // const [data, setData] = useState([])

  const [date, setDate] = useState(new Date())

  const [isLoading, setIsLoading] = useState(true)


  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [checked, setChecked] = useState(false)

  if(plateNo == '' && data.length != 0){
    console.log("setting data");
    if(!plateSet){
      setPlateNo(data[0].carPlateNumber)
      setPlateSet(true)
    }
    
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
      setFoundCoords(location.coords)
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

  const geocode = async (loc) => {
    console.log("getting coords with address:", loc);
    let geoCode = await Location.geocodeAsync(loc)
    console.log("User Location in Coords: ");
    console.log(geoCode.length != 0 ? geoCode : "Not found.", geoCode);
    
    geoCode.length != 0 ? setCoords({latitude: geoCode[0].latitude, longitude: geoCode[0].longitude}) : console.log("not setting.");
    console.log("coords:", coords);

    geoCode.length != 0 ? continueUpload() : Alert.alert("Location not found.", "Please enter a new address.")
  }


  const addParking = () => {
    console.log("adding parking...");

    if(!checked){
        
    
      if(buildingCode == '' || plateNo == '' || suit == '' || location == '') {
        console.log("BC:", buildingCode, "PN:", plateNo, "S:", suit, "L:", location);
        Alert.alert(
          "Missing Fields",
          "Please fill in all fields"
        )
        return;
      } 
    }
    else {
      if(buildingCode == '' || plateNo == '' || suit == '') {
        console.log("BC:", buildingCode, "PN:", plateNo, "S:", suit, "L:", location);
        Alert.alert(
          "Missing Fields",
          "Please fill in all fields"
        )
        return;
      }
    }
    
    if(buildingCode.length != 5){
      Alert.alert(
        "Invalid Building Code",
        "Building codes must be exactly 5 characters."
      )
      return;
    }

    if(plateNo.length < 2 || plateNo.length > 8){
      Alert.alert(
        "Invalid Plate Number",
        "Plate Numbers must be between 2 and 8 characters."
      )
      return;
    }

    if(suit.length < 2 || suit.length > 5){
      Alert.alert(
        "Invalid Suit Number",
        "Suit Numbers must be between 2 and 5 characters."
      )
      return;
    }


    if(checked) {
      setCoords({latitude: foundCoords.latitude, longitude: foundCoords.longitude})
      setLocation(userLocation)
      console.log("found", foundCoords);
      console.log(coords);
      continueUpload()
    } else {
      console.log("getting coords...");
      geocode(location)
    }


  }

  const continueUpload = () => {

    console.log("continuing");

    if(coords == null){
      setCoords({latitude: 0, longitude: 0})
    }

    Firebase.firestore()
      .collection("AddedParking")
      .doc(data[0].email)
      .collection("ParkingList")
      .add({
        buildingCode: buildingCode,
        carPlateNumber: plateNo,
        date: new Date(date),
        email: data[0].email,
        hoursSelection: time,
        parkingAddr: location,
        parkingLat: coords.latitude,
        parkingLon: coords.longitude,
        suitNo: suit,

      })
      .then((docRef) => {
        console.log("doc written with id:", docRef.id);
        Alert.alert(
          "Success!",
          "Added parking successfully. You can find it in your parking list."
        )
      })
      .catch((error) => {
        console.log("error:", error);
      })
    
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
        placeholder = "Building Code"
        placeholderTextColor = "gray"
        returnKeyType = "next"
        value = {buildingCode}
        onChangeText = {setBuildingCode}
        textContentType = "name"
        autoCapitalize="none"
        />
        <Text style={styles.InputTitle}>How many hours do you intend to park?</Text>
        <Picker
        style={{width: "100%", height: Platform.OS === "ios" ? 200 : 50}}
          selectedValue={value}
          onValueChange={(itemValue, itemIndex) => {
            setTime(itemIndex)
            setValue(itemValue)
            console.log(itemIndex)
          }
          }>
          <Picker.Item color="#afafaf" label="1 Hour or less" value="0" />
          <Picker.Item color="#afafaf" label="4-Hour" value="1" />
          <Picker.Item color="#afafaf" label="12-Hour" value="2" />
          <Picker.Item color="#afafaf" label="24-Hour" value="3" />
        </Picker>


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

        <Text style={styles.InputTitle}>Suit Number (2-5 Characters)</Text>
        <TextInput 
        style={styles.input}
        placeholder = "Suit Number"
        placeholderTextColor = "gray"
        returnKeyType = "next"
        value = {suit}
        onChangeText = {setSuit}
        textContentType = "name"
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
        <Text style={styles.InputTitle}>Date: (Tap Selector to select date, ignore for today)</Text>
        <View style={styles.datePickerArea}>
          <DatePicker
          style={styles.datePickerStyle}
          date={date} //initial date from state
          mode="date" //The enum of date, datetime and time
          placeholder="select date"
          format="YYYY/MM/DD"
          minDate={today}
          
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              //display: 'none',
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0,
              backgroundColor: "#333"
            },
            dateInput: {
              marginLeft: 36,
              backgroundColor: "#333"
            },
            datePicker: {color: 'black', backgroundColor: 'white',},
            datePickerCon: {color: 'black', backgroundColor: 'white',}
          }}
          onDateChange={(date) => {
            console.log("settingf dateL ", date);
            let newDate = new Date(date)
            setDate(newDate);
            console.log(date);
          }}
        />
        <Text style={styles.datePickerText}>{JSON.stringify(date)}</Text>
        </View>

        <View style={styles.addParking}>
        <TouchableOpacity onPress={addParking}>
          <Text style={styles.button}>Add Parking</Text>
        </TouchableOpacity>
      </View>
        
      </ScrollView>
      
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
  addParking: {
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
  datePickerStyle: {
    width: 200,
    marginTop: 20,
    color: "white"
  },
  datePicker: {
    color: 'black',
    backgroundColor: 'white',
  },
  datePickerCon: {
    color: 'black',
    backgroundColor: 'white',
  },
  datePickerArea: {
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center'
  },
  datePickerText: {
    width: "95%",
    padding: 10,
    backgroundColor: "white",
    color: "black",

    height: 40,
    margin: 12,
    paddingHorizontal: 10,
    borderColor : 'gray',
    borderWidth: 1,
  }
  
});
