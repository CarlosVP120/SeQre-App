import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  Dimensions,
  Alert,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useTailwind } from "tailwind-rn";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../navigator/TabNavigator";
import { RootStackParamList } from "../navigator/RootNavigator";
import { Image, Input, Card, Button } from "@rneui/themed";
import { GET_CUSTOMERS } from "../graphql/queries";
import { useQuery } from "@apollo/client";
import CustomerCard from "../components/CustomerCard";
import { ref, onValue, getDatabase, set, update } from "firebase/database";
import { auth } from "../firebase";
import { onSnapshot, collection } from "firebase/firestore";
import db from "../firebase";
import axios from "axios";
import { registerIndieID } from "native-notify";
import * as Location from "expo-location";

export type CustomersScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, "Areas">,
  NativeStackNavigationProp<RootStackParamList>
>;

const CustomersScreen = (
  { setGlobalLocation }: any,
  { globalLocation }: any
) => {
  // AREAS SCREEN
  const [dataArray, setDataArray] = useState([]);
  const tw = useTailwind();
  const navigation = useNavigation<CustomersScreenNavigationProp>();
  const [input, setInput] = useState<string>("");

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  const [pin, setPin] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });

  // // Get location
  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       Alert.alert(
  //         "Location is necessary",
  //         "Permission to access location was denied, make sure to enable location services in your device settings."
  //       );
  //       return;
  //     }

  //     let locations = await Location.getCurrentPositionAsync({});
  //     setLocation(locations);
  //   })();
  // }, []);

  // const lat = location?.coords.latitude;
  // const lng = location?.coords.longitude;

  useEffect(() => {
    if (globalLocation?.lat && globalLocation?.lng) {
      registerIndieID(
        `${globalLocation?.lat},${globalLocation?.lng},${auth.currentUser?.uid}`,
        5422,
        "LZxJt15e9Y41RHQxbR7lbx"
      );

      update(ref(getDatabase(auth.app), `customers/${auth.currentUser?.uid}`), {
        pushNotificationKey: `${globalLocation?.lat},${globalLocation?.lng},${auth.currentUser?.uid}`,
      });
    }
  }, [globalLocation?.lat, globalLocation?.lng]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    // SEND TO EVERYONE
    // fetch("https://app.nativenotify.com/api/notification", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     appId: 5422,
    //     appToken: "LZxJt15e9Y41RHQxbR7lbx",
    //     title: "Push title here as a string",
    //     body: "Push message here as a string",
    //     dateSent: "12-22-2022 9:10PM",
    //   }),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
  }, []);

  // read data from firestore collection
  useEffect(() => {
    const data = onSnapshot(collection(db, "Areas"), (snapshot) => {
      setDataArray([]);
      snapshot.forEach((doc) => {
        // @ts-ignore
        setDataArray((dataArray) => [
          ...dataArray,
          { id: doc.id, ...doc.data() },
        ]);
      });
    });

    return data;
  }, []);

  const dataList = dataArray.map((data) => (
    <CustomerCard
      key={data["id"]}
      name={data["id"]}
      email={data["conforms"]}
      userId={data["id_area"]}
      publishArray={data}
    />
  ));

  return (
    <>
      <View style={tw("flex-1 bg-white")}>
        <ImageBackground
          resizeMode="cover"
          source={require("../assets/inside-app.jpeg")}
          style={[
            tw("w-full "),
            { height: Dimensions.get("window").height / 2.5 },
          ]}
        >
          <View
            style={tw("flex-row justify-center items-center mt-16 mx-auto")}
          >
            <Image
              source={require("../assets/logo.png")}
              style={{ width: 80, height: 40, marginRight: 10 }}
            />
            <Text
              style={tw(
                "text-white justify-center text-center text-3xl font-bold"
              )}
            >
              Zonas
            </Text>
          </View>
        </ImageBackground>
        <View
          style={[
            tw("bg-white"),
            {
              flex: 1.5,
              bottom: 220,
              borderTopStartRadius: 40,
              borderTopEndRadius: 40,
            },
          ]}
        >
          <View style={[tw(""), { paddingTop: 10 }]}>
            <View style={{ marginTop: 10 }}>
              <Input
                placeholder="Buscar por municipio..."
                style={tw("font-bold")}
                value={input}
                onChangeText={setInput}
                containerStyle={tw(
                  "bg-gray-200 pt-5 pb-0 px-10 rounded-full w-11/12 mx-auto mb-3"
                )}
              />
              <Card.Divider
                style={tw("mb-0 w-full mx-auto mt-3")}
                // color purple
                color="#59C1CC"
                width={2}
              />

              <ScrollView style={{ backgroundColor: "white" }}>
                {dataList.filter((data) => data.props.name.includes(input))}
                <View style={{ height: 30 }} />
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default CustomersScreen;
