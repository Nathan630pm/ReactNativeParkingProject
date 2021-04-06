import React,{ useState } from 'react';
import type {Node} from 'react';
import {SafeAreaView, StyleSheet, TextInput, Text, Button, View, Alert, Switch, TouchableOpacity, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

 const Checkbox : (props) => Node = (props) => {

   const [checkbox, setIsEnabled] = useState(props.isChecked)

   const setChecked = props.setChecked;

    return(

      <View>
      { checkbox == true ?
        <TouchableOpacity style={{flexDirection:'row', alignItems: 'center'}} onPress={() => {setIsEnabled(false), setChecked(false)}}>
            <Ionicons name={"checkbox"} size={25} color={"#00a800"} />
            <Text style={styles.checkboxText}>Use Current Location?</Text>
        </TouchableOpacity>
        :
        <TouchableOpacity style={{flexDirection:'row', alignItems: 'center'}}  onPress={() => {setIsEnabled(true), setChecked(true)}}>
            <Ionicons name={"checkbox-outline"} size={25} color={"#afafaf"} />
            <Text style={styles.checkboxText}>Use Current Location?</Text>
        </TouchableOpacity>
      }

      </View>
    );

 }

 const styles = StyleSheet.create({
   checkboxText: {
    color: "#afafaf",
    fontSize: 20,
    paddingLeft: 5,
    
  },
 })


 export default Checkbox;
