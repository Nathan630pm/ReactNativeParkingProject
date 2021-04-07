import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform, FlatList, Dimensions } from 'react-native';

import Firebase from './FirebaseConfig';
import 'firebase/firestore';

import {Database} from './Database'

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

export default function ViewParkingScreen({route, navigation, data}) {

  

  const [isLoading, setIsLoading] = useState(true)
  // const [data, setData] = useState([])
  
  // setData(tabData)
  
  const [parking, setParking] = useState([])

  const [gotData, setGotData] = useState(false)
  
  const [isFetching, setIsFetching] = useState(false)



  useEffect(() => {
  
    (async () => {
      
      
    })();
  }, []);

  const onRefresh = () => {
    setIsFetching(true)
    Firebase.firestore()
      .collection("AddedParking")
      .doc(data[0].email)
      .collection("ParkingList")
      .get()
      .then((querySnapshot) => {
        console.log("parking running");
        let parkingData = []
        querySnapshot.forEach((doc) => {
          
          console.log(doc.id, "=>", JSON.stringify(doc.data()));

          

          const newDoc = doc.data()
          newDoc.id = doc.id
          
          parkingData.push(newDoc)

          
        })
        
        console.log("Parking Data: ");
        setParking([])
        setParking(parkingData)
        setIsLoading(false)
        setIsFetching(false)
      })
      .catch((error) => {
        console.log("ewwor:", error);
      });
  }

  


  
  

  

  const getParking = (data, setParking) => {
    
  }

  if(data.length != 0 && gotData == false) {
    console.log("Getting Parking with data: ", JSON.stringify(data));
    Firebase.firestore()
      .collection("AddedParking")
      .doc(data[0].email)
      .collection("ParkingList")
      .get()
      .then((querySnapshot) => {
        console.log("parking running");
        let parkingData = []
        querySnapshot.forEach((doc) => {
          
          console.log(doc.id, "=>", JSON.stringify(doc.data()));

          

          const newDoc = doc.data()
          newDoc.id = doc.id
          
          parkingData.push(newDoc)

          
        })
        
        console.log("Parking Data: ");
        setParking(parkingData)
        setIsLoading(false)
      })
      .catch((error) => {
        console.log("ewwor:", error);
      });
    // getParking(data[0])
    setGotData(true)
  }


  const Item = ({item, onPress, onLongPress}) => {

    var date = new Date(1970, 0, 1);
    var seconds = item.date.seconds
    date.setSeconds(seconds)
    return(
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
      >
        <View style={styles.item}>
          <Text style={styles.parkingAddr}>Parking Address: {item.parkingAddr}</Text>
          <Text style={styles.plateNo}>Car Plate Number: {item.carPlateNumber}</Text>
          <Text style={styles.parkingDate}>Parking Date: {JSON.stringify(date)}</Text>
          <Text style={styles.parkingInfo}>Tap to view parking details. Long Press to delete.</Text>
        </View>
      </TouchableOpacity>
      
    )
  }


  const renderItem = ({item}) => {
    return(
      <Item 
        item={item}
        onPress={() => onItemPressed(item)}
        onLongPress={() => onItemLongPressed(item)}
      />
    )
  }

  const onItemLongPressed = (item) => {
    console.log(item.id, "long pressed");

    Alert.alert(
      'Are you sure?',
      'Are you sure you want to delete this parking? This action cannot be undone.',
      [     
        {       
          text: 'Cancel',       
          onPress: () => console.log('Cancel Pressed'),       
          style: 'cancel',     
        },     
        {
          text: 'OK', 
          onPress: () => continueDelete(item)
        },   
      ],   
      { cancelable: false }, 
    );
    

  }

  const continueDelete = (item) => {
    Firebase.firestore()
      .collection("AddedParking")
      .doc(data[0].email)
      .collection("ParkingList")
      .doc(item.id)
      .delete()
      .then(() => {
        console.log("document deleted successfully.")
        Alert.alert(
          "Success!",
          "Parking was removed."
        )
        onRefresh()
      })
      .catch((error) => {
        console.log("ewwor:", error);
      });
  }


  const onItemPressed = (item) => {
    console.log("Item", item.id, "pressed.");
    navigation.navigate("Parking Detials", {item: item})
  }


  return (
    <View style={styles.container}>
      
      {isLoading == true ?
        <View style={styles.AILoading}>
          <ActivityIndicator size="large" color={Platform.OS === 'ios' ? "grey" : "#00a800"} />
          <Text style={{color: "#afafaf"}}>Loading Parking...</Text>
        </View> : 
        <FlatList
          style={styles.list}
          keyExtractor={(item, index) => {return item.id  + ""}}
          data={parking}
          renderItem={renderItem}
          onRefresh={() => onRefresh()}
          refreshing={isFetching}
        />}
    </View>
  );
}


const Parking = () => {


  return(
    <View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  AILoading: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  image: {
    width: screenWidth,
    height: 200,
    resizeMode: "cover",
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    width: screenWidth,
    height: screenHeight,
  },
  item: {
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#222"
  },
  title: {
    fontSize: 30,
    color: "#333",
    textAlign: 'center',
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    width: "90%",
    borderRadius: 10,
  },
  parkingAddr: {
    textAlign: "left",
    color: "#afafaf",
    fontSize: 20,
    fontWeight: 'bold'
  },
  plateNo: {
    textAlign: "left",
    color: "#afafaf"
  },
  parkingDate: {
    textAlign: "left",
    color: "#afafaf"
  },
  parkingInfo: {
    textAlign: "left",
    color: "#afafaf",
    fontSize: 11,
  }
});
