import { View, Text, Alert } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CustomersScreen from "../screens/Areas";
import OrdersScreen from "../screens/Nearby";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import New from "../screens/NewPublishScreen";
import MyPublishes from "../screens/MyPublishes";
import { RootStackParamList } from "./RootNavigator";
import Settings from "../screens/Settings";
import Toast from "react-native-toast-message";
import * as Location from "expo-location";

export type TabStackParamList = {
  Areas: undefined;
  Nearby: undefined;
  New: undefined;
  Settings: undefined;
};

type MainScreenRouteProp = RouteProp<RootStackParamList, "Login">;

const Tab = createBottomTabNavigator<TabStackParamList>();

const TabNavigator = () => {
  const [lat, setLat] = useState<number>();
  const [lng, setLng] = useState<number>();
  const [addressName, setAddress] = useState<string>();
  const [township, setTownship] = useState<string>();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  const [globalLocation, setGlobalLocation] = useState({});

  // Get the user location and data from the Areas collection
  useEffect(() => {
    (async () => {
      console.log("getting location");
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
      console.log("LOCATIONS: ", locations);

      const lat = locations?.coords.latitude;
      setLat(lat);
      // add the latitude to the global state

      const lng = locations?.coords.longitude;
      setLng(lng);
      // add the longitude to the global state

      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=es`;

      if (locations) {
        let data = await Location.reverseGeocodeAsync({
          // @ts-ignore
          latitude: lat,
          // @ts-ignore
          longitude: lng,
        }).then((data) => {
          if (data[0].street === null) {
            setAddress(data[0].name as string);
            // add the address to the global state
          } else {
            setAddress(data[0].street + " " + data[0].streetNumber);
            // add the address to the global state
          }
        });
        console.log(addressName);
      }

      // Get the township from the user location
      fetch(url)
        .then((response) => response.json())
        .then((response) => {
          setTownship(response.localityInfo.administrative[2].name);
          console.log(response.localityInfo.administrative[2].name);
          // add the township to the global state
        });
    })();

    setGlobalLocation({
      lat: lat,
      lng: lng,
      address: addressName,
      township: township,
    });
  }, []);

  console.log("GLOBAL LOCATION: ", globalLocation);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#59c1cc",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Areas") {
            return (
              <Icon
                name="map"
                type="entypo"
                color={focused ? "#59c1cc" : "gray"}
              />
            );
          } else if (route.name === "Nearby") {
            return (
              <Icon
                name="location-pin"
                type="entypo"
                color={focused ? "#59c1cc" : "gray"}
              />
            );
          } else if (route.name === "New") {
            return (
              <Icon
                name="plus"
                type="entypo"
                color={focused ? "#59c1cc" : "gray"}
              />
            );
          } else if (route.name === "Settings") {
            return (
              <Icon
                name="account-settings"
                type="material-community"
                color={focused ? "#59c1cc" : "gray"}
              />
            );
          }
        },
      })}
    >
      <Tab.Screen
        name="Areas"
        options={{ tabBarLabel: () => null }}
        children={() => (
          <CustomersScreen
            setGlobalLocation={setGlobalLocation}
            gloablLocation={globalLocation}
          />
        )}
      />
      <Tab.Screen
        name="Nearby"
        options={{ tabBarLabel: () => null }}
        children={() => (
          <OrdersScreen
            setGlobalLocation={setGlobalLocation}
            gloablLocation={globalLocation}
          />
        )}
      />
      <Tab.Screen
        name="New"
        options={{ tabBarLabel: () => null }}
        children={() => (
          <MyPublishes
            setGlobalLocation={setGlobalLocation}
            gloablLocation={globalLocation}
          />
        )}
      />
      <Tab.Screen
        name="Settings"
        options={{ tabBarLabel: () => null }}
        children={() => (
          <Settings
            setGlobalLocation={setGlobalLocation}
            gloablLocation={globalLocation}
          />
        )}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
