import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform, ScrollView } from 'react-native';

import Firebase from './FirebaseConfig';
require("firebase/firestore");



export default function RegisterScreen({navigation}) {

  var db = Firebase.firestore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [cpassword, setCpassword] = useState('');

  const [plate, setPlate] = useState('');
  const [phone, setPhone] = useState(null);

  let [isLoading, setIsLoading] = useState(false);

  const continueRegister = () => {
    Alert.alert(
      "Success!",
      "You've successfully registered. You may now log in.",
      [
        {text: 'OK', onPress: navigation.goBack()},
      ]
    )
  }

  
 
  const login = () => {
    setIsLoading = true;
    if(name == null || name == '' || username == null || username == '' || password == null || password == '' || cpassword == null || cpassword == '' || plate == null || plate == '' || phone == null || phone == ''){
      setIsLoading = false;
      Alert.alert(
        "Missing information",
        "Please fill in all fields!"
      )  
    }else {
      if(cpassword != password){
        Alert.alert(
          "Error:",
          "Passwords do not match."
        )
        return;
      }
      else {
        Firebase.auth()
        .createUserWithEmailAndPassword(username, password)
        .then(() => {
          console.log("Continuing Registration...");
          Firebase.firestore().collection("Parking").add({
            carPlateNumber: plate,
            contactNumber: phone,
            email: username,
            name: name
          })
          .then((docRef) => {
              console.log("Document written with ID: ", docRef.id);
              Alert.alert(
                "Success!",
                "You've successfully registered. You may now log in.",
                [
                  {text: 'OK', onPress: navigation.goBack()},
                ]
              )
          })
          .catch((error) => {
              console.error("Error adding document: ", error);
          });
        })
        .catch((error) => {
          setIsLoading = false;
          let err = "" + error + "";
          console.log(err);
          Alert.alert(
            "Error:",
            error.message
          )
        })
      }
    }
  }

  return (
    <ScrollView style={styles.container}>

      <TextInput 
        style={styles.input}
        placeholder = "Your Name"
        placeholderTextColor = "gray"
        returnKeyType = "next"
        value = {name}
        onChangeText = {setName}
        textContentType = "username"
        autoCapitalize="none"
      />

      <TextInput 
        style={styles.input}
        placeholder = "Your Email"
        placeholderTextColor = "gray"
        returnKeyType = "next"
        value = {username}
        onChangeText = {setUsername}
        textContentType = "username"
        autoCapitalize="none"
      />

        <TextInput 
          style={styles.input}
          placeholder = "Your Password"
          placeholderTextColor = "gray"
          returnKeyType = "next"
          value = {password}
          onChangeText = {setPassword}
          textContentType = "password"
          autoCapitalize="none"
          secureTextEntry={true}
        />

        <TextInput 
          style={styles.input}
          placeholder = "Confirm Your Password"
          placeholderTextColor = "gray"
          returnKeyType = "next"
          value = {cpassword}
          onChangeText = {setCpassword}
          textContentType = "password"
          autoCapitalize="none"
          secureTextEntry={true}
        />

      <TextInput 
        style={styles.input}
        placeholder = "Your Car Plate Number"
        placeholderTextColor = "gray"
        returnKeyType = "next"
        value = {plate}
        onChangeText = {setPlate}
        textContentType = "none"
        autoCapitalize="none"
      />

      <TextInput 
        style={styles.input}
        placeholder = "Your Phone Number"
        placeholderTextColor = "gray"
        returnKeyType = "next"
        value = {phone}
        onChangeText = {setPhone}
        keyboardType = 'numeric'
        textContentType = "telephoneNumber"
        autoCapitalize="none"
      />

        <View style={styles.addFriend}>
        <TouchableOpacity onPress={login}>
          <Text style={styles.button}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.registerText}>Already have an account? Login.</Text>
        </TouchableOpacity>
        
      </View>
      {isLoading == true ?
        <View style={styles.AILoading}>
          <ActivityIndicator size="large" color="#00A800" />
        </View> : null}


    </ScrollView>
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
  registerText: {
    color: "#afafaf",
    fontSize: 15,
  },
  AILoading: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(0,0,0,0.5)"
  }
});
