import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';

import Firebase from './FirebaseConfig';

export default function LoginScreen({navigation}) {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  let [isLoading, setIsLoading] = useState(false)

  
 
  const login = () => {
    setIsLoading = true;
    if(username == null || username == '' || password == null || password == ''){
      setIsLoading = false;
      Alert.alert(
        "Missing information",
        "Please fill in all fields!"
      )  
    }else {
      Firebase.auth()
        .signInWithEmailAndPassword(username, password)
        .then(() => navigation.replace("Parking"))
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
