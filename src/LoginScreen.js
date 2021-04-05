import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';

import Firebase from './FirebaseConfig';
import 'firebase/firestore';

import {Database} from './Database'

export default function LoginScreen({navigation, route}) {

  Database.createTable();
  Database.deleteAll();
  Database.initializeData();
  Database.getAllData()

  const [username, setUsername] = useState('Nathan630pm@outlook.com')
  const [password, setPassword] = useState('Nat1212')

  const [isLoading, setIsLoading] = useState(false)

  
 
  const login = () => {
    setUsername(username.replace(/\s/g, ''))
    setIsLoading(true);
    if(username == null || username == '' || password == null || password == ''){
      setIsLoading = false;
      Alert.alert(
        "Missing information",
        "Please fill in all fields!"
      )  
    }else {
      Firebase.auth()
        .signInWithEmailAndPassword(username, password)
        .then(() => {
          const userEmail = username

          continueLogin(username.toLowerCase())

          
        })
        .catch((error) => {
          let err = "" + error + "";
          console.log(err);
          Alert.alert(
            "Error:",
            error.message
          )
          setIsLoading(false);
        })
    }
  }

  const continueLogin = (username) => {
    console.log(username);
    Firebase.firestore()
      .collection("Parking")
      .where("email", "==", username)
      .get()
      .then((querySnapshot) => {
        console.log("running");
        querySnapshot.forEach((doc) => {
          
          console.log(doc.id, "=>", JSON.stringify(doc.data()));
          const userData = {
            name: doc.data().name,
            email: doc.data().email,
            carPlateNumber: doc.data().carPlateNumber,
            contactNumber: doc.data().contactNumber
          }

          Database.updateData(userData)
          Database.getAllData()

          navigation.replace("Parking", {screen: "View Parking", params: {navigation: navigation}})
          setIsLoading(false)
        })
      })
      .catch((error) => {
        console.log("ewwor:", error);
      });
  }

  return (
    <View style={styles.container}>
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

        <View style={styles.addFriend}>
        <TouchableOpacity onPress={login}>
          <Text style={styles.button}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>Don't have an account? Register now.</Text>
        </TouchableOpacity>
        
      </View>
      {isLoading == true ?
        <View style={styles.AILoading}>
          <ActivityIndicator size="large" color={Platform.OS === 'ios' ? "grey" : "#00a800"} />
        </View> : null}


    </View>
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
