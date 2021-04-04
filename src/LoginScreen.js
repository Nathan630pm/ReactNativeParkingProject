import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

// import Firebase from './FirebaseConfig';

export default function LoginScreen({navigation}) {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  
 
  const login = () => {
    if(username == null || username == '' || password == null || password == ''){
      Alert.alert(
        "Missing information",
        "Please fill in all fields!"
      )  
    }else {
      Firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => navigation.navigate("Parking"))
        .catch(error => console.log(error))
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
  }
});
