import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform, Dimensions, PermissionsAndroid, ScrollView, SafeAreaView } from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default function ParkingDetails({route, navigation}) {

  const {item} = route.params;

  console.log(item.id);

  const hours = [
    "1 Hour or less",
    "4-Hour",
    "12-Hour",
    "24-Hour"
  ]

  const [region, setRegion] = React.useState({
    latitude: item.parkingLat,
    longitude: item.parkingLon,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  })

  const parkingLocation = {
    latitude: item.parkingLat,
    longitude: item.parkingLon,
  }

  const viewDirections = () => {
    console.log("viewing", item.id, "directions...");
    navigation.navigate("Parking Map", {item: item})
  }

  


  return (
    <SafeAreaView style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <ScrollView style={styles.parkingDetials}>
          <Text style={styles.parkingAddr}>Parking Address: {item.parkingAddr}</Text>
          <Text style={styles.plateNo}>Car Plate Number: {item.carPlateNumber}</Text>
          <Text style={styles.parkingDate}>Parking Date: {JSON.stringify(Date(item.date.seconds))}</Text>
          <Text style={styles.parkingInfo}>Hours Selected: {hours[item.hoursSelection]}</Text>
          <Text style={styles.parkingInfo}>Building Code: {item.buildingCode}</Text>
          <Text style={styles.parkingInfo}>Parking Address Suit: {item.suitNo}</Text>
        </ScrollView>
      </View>
      
      <View style={styles.mapView}>
        <MapView 
        style={styles.map} 
        region={region}
        showsUserLocation={false}

        zoomEnabled={false}
        zoomTapEnabled={false}
        zoomControlEnabled={false}
        moveOnMarkerPress={false}
        scrollEnabled={false}
        rotateEnabled={false}
        
        showsCompass={true}
        provider="google"
        >

        <Marker
          pinColor="red"
          title="Parking Location"
          description={item.parkingAddr}
          coordinate = {parkingLocation}
        />
        

        
        

        </MapView>
      </View>

      <View style={styles.mapViewButton}>
        <TouchableOpacity onPress={viewDirections}>
          <Text style={styles.button}>View Directions</Text>
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: 'center',
    
  },
  parkingDetials: {
    padding: 10,
    width: deviceWidth,
    height: deviceHeight/2.5,
    backgroundColor: "#222",
    
  },
  mapViewButton: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: 'center'
  },
  button: {
    backgroundColor: "#00A800",
    color: 'white',
    padding: 10,
    alignItems: 'center'
  },
  parkingAddr: {
    textAlign: "left",
    color: "#afafaf",
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 3,
  },
  plateNo: {
    textAlign: "left",
    color: "#afafaf",
    paddingVertical: 3,
  },
  parkingDate: {
    textAlign: "left",
    color: "#afafaf",
    paddingVertical: 3,
  },
  parkingInfo: {
    textAlign: "left",
    color: "#afafaf",
    paddingVertical: 3,
  },
  map: {
    width: '100%',
    height: '50%',
    flex: 1,
  },
  mapView: {
    height: deviceHeight/2,
    backgroundColor: "#111",
  }
});
