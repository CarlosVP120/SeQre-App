import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  CompositeNavigationProp,
  RouteProp,
  useNavigation,
} from "@react-navigation/native";
import { RootStackParamList } from "../navigator/RootNavigator";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { TabStackParamList } from "../navigator/TabNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTailwind } from "tailwind-rn/dist";
import { Button, Card, Image, Input } from "@rneui/themed";
import OrderCard from "../components/OrderCard";
import { getDatabase, onValue, ref } from "firebase/database";
import { auth } from "../firebase";
import DropDownPicker from "react-native-dropdown-picker";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import * as Location from "expo-location";
import { collection, onSnapshot, getDoc, doc } from "firebase/firestore";
import db from "../firebase";

export type OrdersScreenRouteProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, "Nearby">,
  NativeStackNavigationProp<RootStackParamList, "Order">
>;

const OrdersScreen = () => {
  const navigation = useNavigation<OrdersScreenRouteProp>();

  const tw = useTailwind();

  const [orders, setOrders] = useState([]);
  const [dataArray, setDataArray] = useState([]);
  const [ascending, setAscending] = useState<boolean>(false);

  const [active, setActive] = useState(false);
  const [value, setValue] = useState("Todos");

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  const [address, setAddress] = useState("");
  const [township, setTownship] = useState("");

  const [mergedArray, setMergedArray] = useState([]);

  let deg2rad = require("deg2rad");

  const getDistance = (lat1: any, lon1: any, lat2: any, lon2: any) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  };

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
      console.log(locations);

      const lat = locations?.coords.latitude;
      const lng = locations?.coords.longitude;

      console.log("lat: ", lat);
      console.log("lng: ", lng);

      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=es`;

      // Get the township from the user location
      fetch(url)
        .then((response) => response.json())
        .then((response) => {
          const data = onSnapshot(
            doc(db, "Areas", response.localityInfo.administrative[2].name),
            (snapshot) => {
              setMergedArray([]);
              const data = snapshot.data();
              // merge all of the arrays inside the data object into one array
              setMergedArray(
                // @ts-ignore
                data["Alertas"]
                  // @ts-ignore
                  .concat(data["Emergencias"])
                  // @ts-ignore
                  .concat(data["Vialidad"])
              );
            }
          );
          return data;
        })
        .then(() => {
          // Get the data from the Areas collection where the name if the document is equal to the township
        });
    })();
  }, [location]);

  // Get the address from the user location
  // useEffect(() => {
  //   (async () => {
  //     if (location) {
  //       let address = await Location.reverseGeocodeAsync({
  //         // @ts-ignore
  //         latitude: lat,
  //         // @ts-ignore
  //         longitude: lng,
  //       });
  //       setAddress(address[0].street + " " + address[0].streetNumber);
  //     }
  //   })();
  // }, [location]);

  // // Get the township from the user location
  // fetch(url)
  //   .then((response) => response.json())
  //   .then((data) => {
  //     setTownship(data.localityInfo.administrative[2].name);
  //   })
  //   .then(() => {
  //     const data = onSnapshot(doc(db, "Areas", township), (snapshot) => {
  //       setMergedArray([]);
  //       const data = snapshot.data();
  //       // merge all of the arrays inside the data object into one array
  //       setMergedArray(
  //         // @ts-ignore
  //         data["Alertas"].concat(data["Emergencias"]).concat(data["Vialidad"])
  //       );
  //     });
  //     return data;
  //   });

  // Get the data from the Areas collection where the name if the document is equal to the township
  // useEffect(() => {
  //   (async () => {
  //     const data = onSnapshot(doc(db, "Areas", township), (snapshot) => {
  //       setMergedArray([]);
  //       const data = snapshot.data();
  //       // merge all of the arrays inside the data object into one array
  //       setMergedArray(
  //         // @ts-ignore
  //         data["Alertas"].concat(data["Emergencias"]).concat(data["Vialidad"])
  //       );
  //     });
  //     return data;
  //   })();
  // }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      tabBarLabel: ({ focused, color }) => null,
    });
  }, []);

  const toConcatArray = [];

  // if (dataArray.length > 0) {
  //   for (let i = 0; i < dataArray.length; i++) {
  //     toConcatArray.push(
  //       dataArray[i]["Alertas"]
  //         // @ts-ignore
  //         .concat(dataArray[i]["Emergencias"])
  //         .concat(dataArray[i]["Vialidad"])
  //     );
  //   }
  // }

  // // concatenate all of the arrays inside toConcatArray into one array
  // const mergedArray = toConcatArray.flat();

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <>
      <View style={tw("flex-1 bg-white")}>
        <ImageBackground
          source={require("../assets/inside-app.jpeg")}
          style={[
            tw("w-full"),
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
              Cerca de ti
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
              <View
                style={tw(
                  "flex-row justify-between w-11/12 px-6 font-bold border-0 mx-auto bg-gray-200 rounded-full py-2 mb-3"
                )}
              >
                <TouchableOpacity
                  style={tw(" flex-col self-center")}
                  onPress={() => setValue("Alertas")}
                >
                  <AntDesign
                    style={tw("self-center")}
                    name="warning"
                    color="#59c1cc"
                    size={26}
                  />
                  <Text
                    style={tw(
                      `text-xs ${
                        value === "Alertas"
                          ? "text-blue-500 font-bold"
                          : "text-gray-500"
                      }`
                    )}
                  >
                    Alertas
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw(" flex-col self-center")}
                  onPress={() => setValue("Emergencias")}
                >
                  <MaterialCommunityIcons
                    style={tw("self-center")}
                    name="alarm-light"
                    color="#59c1cc"
                    size={30}
                  />
                  <Text
                    style={tw(
                      `text-xs ${
                        value === "Emergencias"
                          ? "text-blue-500 font-bold"
                          : "text-gray-500"
                      }`
                    )}
                  >
                    Emergencias
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw(" flex-col self-center")}
                  onPress={() => setValue("Vialidad")}
                >
                  <MaterialCommunityIcons
                    style={tw("self-center")}
                    name="road-variant"
                    color="#59c1cc"
                    size={30}
                  />
                  <Text
                    style={tw(
                      `text-xs ${
                        value === "Vialidad"
                          ? "text-blue-500 font-bold"
                          : "text-gray-500"
                      }`
                    )}
                  >
                    Vialidad
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw(" flex-col self-center")}
                  onPress={() => setValue("Todos")}
                >
                  <MaterialCommunityIcons
                    style={tw("self-center")}
                    name="expand-all"
                    color="#59c1cc"
                    size={30}
                  />
                  <Text
                    style={tw(
                      `text-xs ${
                        value === "Todos"
                          ? "text-blue-500 font-bold"
                          : "text-gray-500"
                      }`
                    )}
                  >
                    Todos
                  </Text>
                </TouchableOpacity>
              </View>

              <Card.Divider
                style={tw("mb-0 w-full mx-auto mt-3")}
                color="#59C1CC"
                width={2}
              />

              {/* If the Lat and Lng of the item is inside a range of 2000 meters around the user location */}
              <ScrollView style={{ backgroundColor: "white", height: 540 }}>
                {mergedArray

                  .filter((item) => {
                    if (value == "Alertas") {
                      return (
                        item["categoria"] == "Alertas" &&
                        // @ts-ignore
                        item["fecha_corta"].includes(today)
                      );
                    } else if (value == "Emergencias") {
                      return (
                        item["categoria"] == "Emergencias" &&
                        // @ts-ignore
                        item["fecha_corta"].includes(today)
                      );
                    } else if (value == "Vialidad") {
                      return (
                        item["categoria"] == "Vialidad" &&
                        // @ts-ignore
                        item["fecha_corta"].includes(today)
                      );
                    } else {
                      // @ts-ignore
                      return item && item["fecha_corta"].includes(today);
                    }
                  })
                  .sort((a, b) => {
                    if (ascending) {
                      return new Date(a["fecha_corta"]) >
                        new Date(b["fecha_corta"])
                        ? 1
                        : -1;
                    } else {
                      return new Date(a["fecha_corta"]) <
                        new Date(b["fecha_corta"])
                        ? 1
                        : -1;
                    }
                  })
                  .map((item) => (
                    <OrderCard
                      key={Math.random().toString(36).substring(7)}
                      category={item["categoria"]}
                      createdAt_short={item["fecha_corta"]}
                      details={item["detalles"]}
                      type={item["tipo"]}
                      Address={item["Address"]}
                      trackingItems={[]}
                      Lat={item["Lat"]}
                      Lng={item["Lng"]}
                    />
                  ))}

                <View style={{ height: 30 }} />
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default OrdersScreen;

// copy the trackingItem
// copy the order
// change the trackingItem identifier and the trackingId of the order to something random
// change the customer_id of trackingItem
