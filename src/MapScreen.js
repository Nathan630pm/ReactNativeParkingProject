import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform, Dimensions, PermissionsAndroid, ScrollView, SafeAreaView } from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default function MapScreen({route, navigation}) {

  const [location, setLocation] = useState({
    coords: {
      latitude: 0,
      longitude: 0,
    }
  });
  const [error, setError] = useState(null);

  const [isLoading, setIsLoading] = useState(true)

  const [map, setMap] = useState(null)

  const {item} = route.params;

  const [region, setRegion] = React.useState({
    latitude: item.parkingLat,
    longitude: item.parkingLon,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  })

  const [currLoc, setCurrLoc] = useState({
    latitude: 0,
    longitude: 0,
  })


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
      setIsLoading(false)
      
      
      setLocation(location);
      console.log(location);
      getGeoAddr(location.coords)

      console.log("Lat:", ((location.coords.latitude)+(item.parkingLat)) /2);
      console.log("Lon:", ((location.coords.longitude)+(item.parkingLon)) /2);
      setRegion({
        latitude: (location.coords.latitude+item.parkingLat) / 2,
        longitude: (location.coords.longitude+item.parkingLon) / 2,
        latitudeDelta: 1,
        longitudeDelta: 1,
      })
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
    geocode();
  }

  const geocode = async () => {
    let geoCode = await Location.geocodeAsync("58 hammell blvd tottenham ontario")
    console.log("User Location in Coords: ");
    console.log(geoCode == [] ? geoCode : "Not found.");
  }

  

  console.log(item.id);


  

  const parkingLocation = {
    latitude: item.parkingLat,
    longitude: item.parkingLon,
  }

  


  return (
    <View style={styles.container}>
      

        {isLoading == true ?
        <View style={styles.AILoading}>
          <ActivityIndicator size="large" color={Platform.OS === 'ios' ? "grey" : "#00a800"} />
          <Text style={{color: "#afafaf"}}>Loading Map...</Text>
        </View> : 
        <MapView 
        style={styles.map} 
        ref={map => {setMap(map)}}
        region={region}
        showsUserLocation={false}
        fitToSuppliedMarkers={[location.coords, parkingLocation]}
        onMapReady={() => {map.fitToSuppliedMarkers(['mk1','mk2'],{ edgePadding: 
          {top: 50,
            right: 50,
            bottom: 50,
            left: 50}

        })}}

        
        
        showsCompass={true}
        provider="google"
        >

        <Marker
          pinColor="red"
          title="Parking Location"
          description={item.parkingAddr}
          coordinate = {parkingLocation}
          identifier={"mk1"}
        />

        <Marker
          pinColor="red"
          title="Your Location"
          description={"Your current location"}
          coordinate = {location.coords}
          identifier={"mk2"}
        />


        <Polyline
          coordinates = {[parkingLocation, location.coords]}
          strokeWidth={5}
        />

        

        </MapView> }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
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
