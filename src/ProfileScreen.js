import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform, ScrollView } from 'react-native';

import {Database} from './Database'

import Firebase from './FirebaseConfig';
import 'firebase/firestore';

export default function ProfileScreen({route, data}) {

  // const {test} = route.params;
  console.log("name:", data[0].name);

  const [userObj, setUserObj] = useState(null)

  const [name, setName] = useState(data[0].name)
  const [email, setEmail] = useState(data[0].email)
  const [plate, setPlate] = useState(data[0].carPlateNumber)
  const [phone, setPhone] = useState(data[0].contactNumber)

  const [docId, setDocId] = useState('')


  const updateProfile = () => {

    Firebase.firestore()
      .collection("Parking")
      .where("email", "==", data[0].email.toLowerCase())
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            setDocId(doc.id)
            continueUpdate(doc.id)
        });
      })
      .catch((error) => {
          console.log("Error getting documents: ", error);
      });

      

  }

  const continueUpdate = (docid) => {
    Firebase.firestore()
      .collection("Parking")
      .doc(docid)
      .update({
        carPlateNumber: plate,
        contactNumber: phone,
        email: email,
        name: name
      })
      .then(() => {
        console.log("Document successfully updated!");
        Alert.alert(
          "Success!",
          "Updated Profile Succesfully."
        )
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
        Alert.alert(
          "Error!",
          "There was a problem updating your profile. \nTry again later."
        )
      });
        }


  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.InputTitle}>Name</Text>
      <TextInput 
          style={styles.input}
          placeholder = "Name"
          placeholderTextColor = "gray"
          returnKeyType = "next"
          value = {name}
          onChangeText = {setName}
          textContentType = "nickname"
          autoCapitalize="none"
          editable={true}
        />

        <Text style={styles.InputTitle}>Email (disabled)</Text>
        <TextInput 
          style={styles.inputDisabled}
          placeholder = "Email"
          placeholderTextColor = "gray"
          returnKeyType = "next"
          value = {email}
          onChangeText = {setEmail}
          textContentType = "nickname"
          autoCapitalize="none"
          editable={false}
        />

        <Text style={styles.InputTitle}>Plate Number</Text>
        <TextInput 
          style={styles.input}
          placeholder = "Plate Number"
          placeholderTextColor = "gray"
          returnKeyType = "next"
          value = {plate}
          onChangeText = {setPlate}
          textContentType = "nickname"
          autoCapitalize="none"
        />

        <Text style={styles.InputTitle}>Phone Number</Text>
        <TextInput 
          style={styles.input}
          placeholder = "Phone Number"
          placeholderTextColor = "gray"
          returnKeyType = "next"
          value = {phone}
          onChangeText = {setPhone}
          textContentType = "nickname"
          autoCapitalize="none"
        />

        <View style={styles.updateProfile}>
        <TouchableOpacity onPress={updateProfile}>
          <Text style={styles.button}>Update Profile</Text>
        </TouchableOpacity>
      </View>
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
    color: 'black',
  },
  updateProfile: {
    alignItems: 'center'
  },
  button: {
    padding: 10,
    margin: 10,
    backgroundColor: "#00A800",
    color: 'white'
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
  InputTitle: {
    color: "#afafaf",
    paddingTop: 5,
    paddingHorizontal: 10,
  },
});
