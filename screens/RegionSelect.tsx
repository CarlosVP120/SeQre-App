import { View, Text, Alert, StatusBar } from "react-native";
import React, { SetStateAction, useEffect, useState } from "react";
import MapView, { Callout, Circle, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useTailwind } from "tailwind-rn/dist";
import { Button, Card, Icon } from "@rneui/themed";
import { getDatabase, ref, set, update } from "firebase/database";
import { auth } from "../firebase";

const Map = () => {
  const [addressName, setAddress] = useState<string>("");

  const setRegionTrue = () => {
    update(ref(getDatabase(auth.app), `/customers/${auth.currentUser?.uid}/`), {
      regionConfirmed: true,
    });
  };

  const tw = useTailwind();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  const [pin, setPin] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });

  useEffect(() => {
    StatusBar.setBarStyle("dark-content", true);
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location is necessary",
          "Permission to access location was denied, make sure to enable location services in your device settings."
        );
        return;
      }

      let locations = await Location.getCurrentPositionAsync({});
      setLocation(locations);
    })();
  }, []);

  // get the address from the location
  useEffect(() => {
    (async () => {
      if (location) {
        let address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setAddress(address[0].street + " " + address[0].streetNumber);
      }
    })();
  }, [location]);

  return (
    // show this when location is available
    location && (
      <>
        <MapView
          rotateEnabled={false}
          scrollEnabled={false}
          showsTraffic={true}
          zoomEnabled={false}
          style={tw("flex-1 w-full h-full")}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          onUserLocationChange={(e) => {
            setPin({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
          }}
        >
          <Marker
            coordinate={pin}
            title="Test Title"
            description="Test Description"
            draggable={false}
          >
            <Callout>
              <Text>Current Location</Text>
            </Callout>
          </Marker>

          <Circle
            center={pin}
            radius={2000}
            fillColor={"rgba(51, 153, 255,0.2)"}
            strokeColor={"rgba(51, 153, 255,0.8)"}
          />
        </MapView>

        <View style={[tw("w-full absolute top-0 mt-20 justify-center")]}>
          <Card
            containerStyle={[
              tw("w-5/6 mt-0 rounded-full mx-auto"),
              { backgroundColor: "rgba(51, 153, 255,1)" },
            ]}
          >
            <View style={tw("px-2 flex-row items-center")}>
              <View>
                <Icon name="location" type="entypo" color="white" />
              </View>

              <View style={tw("ml-4 w-5/6")}>
                <Text style={[tw("text-white text-center"), { fontSize: 10 }]}>
                  Current Location:
                </Text>
                <Text style={tw("text-white font-bold text-base text-center")}>
                  {addressName}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        <Button
          buttonStyle={[
            {
              backgroundColor: "rgba(51, 153, 255,1)",
              borderRadius: 30,
              width: 150,
              height: 60,
            },
          ]}
          titleStyle={{ fontWeight: "bold", fontSize: 20 }}
          color="rgba(51, 153, 255,1)"
          title="Continue"
          onPress={() => {
            if (location) {
              setRegionTrue();
            } else {
              Alert.alert(
                "Location is necessary",
                "Permission to access location was denied, make sure to enable location services in your device settings."
              );
            }
          }}
          containerStyle={tw(
            "w-full absolute bottom-0 mb-20 justify-center items-center"
          )}
        />
      </>
    )
  );
};

export default Map;
