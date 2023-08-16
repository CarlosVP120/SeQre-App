import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Dimensions,
  TextInput,
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
import useCustomerOrders from "../hooks/useCustomerOrders";
import useOrders from "../hooks/useOrders";
import { Button, Card, Image, Input } from "@rneui/themed";
import OrderCard from "../components/OrderCard";
import {
  child,
  get,
  getDatabase,
  onValue,
  push,
  ref,
  set,
  update,
} from "firebase/database";
import { auth } from "../firebase";
import TextField from "../components/TextField";
import DropDownPicker from "react-native-dropdown-picker";
import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import DetailsField from "../components/DetailsField";
import * as Location from "expo-location";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import db from "../firebase";
import Toast from "react-native-toast-message";
import axios from "axios";

export type OrdersScreenRouteProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, "Nearby">,
  NativeStackNavigationProp<RootStackParamList, "NewData">
>;

const OrdersScreen = () => {
  const navigation = useNavigation<OrdersScreenRouteProp>();

  const tw = useTailwind();

  const [details, setDetails] = useState<string>("");
  const [detailError, setDetailError] = useState<string>("");

  const [open, setOpen] = useState(false);
  const [type, setType] = useState(null);
  const [items, setItems] = useState([{ label: "", value: "" }]);

  const [addressName, setAddress] = useState<string>("");

  const [value, setValue] = useState("Todos");
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  const [township, setTownship] = useState<string>("");
  const [dataArray, setDataArray] = useState<any>([]);

  const [latGlobal, setLat] = useState<any>(null);
  const [lngGlobal, setLng] = useState<any>(null);

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

  // useEffect(() => {
  //   (async () => {
  //     if (location) {
  //       let data = await Location.reverseGeocodeAsync({
  //         // @ts-ignore
  //         latitude: lat,
  //         // @ts-ignore
  //         longitude: lng,
  //       }).then((data) => {
  //         if (data[0].street === null) {
  //           setAddress(data[0].name as string);
  //         } else {
  //           setAddress(data[0].street + " " + data[0].streetNumber);
  //         }
  //       });
  //       console.log(addressName);
  //     }
  //   })();
  // }, [location]);

  // const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=es`;

  // fetch(url)
  //   .then((response) => response.json())
  //   .then((data) => {
  //     setTownship(data.localityInfo.administrative[2].name);
  //     console.log(data.localityInfo.administrative[2].name);
  //   });

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

      const lng = locations?.coords.longitude;
      setLng(lng);

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
          } else {
            setAddress(data[0].street + " " + data[0].streetNumber);
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
        });
    })();
  }, [location]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      tabBarLabel: ({ focused, color }) => null,
    });
  }, []);

  useEffect(() => {
    if (value === "Alertas") {
      setItems([
        { label: "Robo", value: "Robo" },
        { label: "Robo a mano armada", value: "Robo a mano armada" },
        { label: "Persona violenta", value: "Persona violenta" },
        { label: "Violencia", value: "Violencia" },
      ]);
    } else if (value === "Emergencias") {
      setItems([
        { label: "Incendio", value: "Incendio" },
        { label: "Persona herida", value: "Persona herida" },
        { label: "Apoyo policial", value: "Apoyo policial" },
        { label: "Apoyo médico", value: "Apoyo médico" },
      ]);
    } else if (value === "Vialidad") {
      setItems([
        { label: "Choque", value: "Choque" },
        { label: "Choque fuerte", value: "Choque fuerte" },
        { label: "Calle bloqueada", value: "Calle bloqueada" },
        { label: "Embotellamiento", value: "Embotellamiento" },
        { label: "Tráfico denso", value: "Tráfico denso" },
      ]);
    } else {
      setItems([]);
    }
  }, [value]);

  useEffect(() => {
    onValue(ref(getDatabase(auth.app), "customers"), (snapshot) => {
      setDataArray([]);
      const data = snapshot.val();
      if (data) {
        for (let id in data) {
          // @ts-ignore
          // save only the pushNotificationKey
          if (data[id].pushNotificationKey) {
            setDataArray((prev: any) => [
              ...prev,
              data[id].pushNotificationKey,
            ]);
          }
        }
      }
    });
  }, []);

  const [nearMe, setNearMe] = useState<any>([]);

  useEffect(() => {
    if (dataArray) {
      setNearMe([]);
      for (let i = 0; i < dataArray.length; i++) {
        const idLat = dataArray[i].split(",")[0];
        const idLng = dataArray[i].split(",")[1];

        const distance = getDistance(latGlobal, lngGlobal, idLat, idLng);

        if (distance < 2) {
          setNearMe((prev: any) => [...prev, dataArray[i]]);
        }
      }
    }
  }, [dataArray]);

  const WriteToDatabase = () => {
    if (value !== "Todos" && type !== null && township !== "") {
      let date = new Date()
        .toLocaleString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        .replace(",", "");

      axios.post(`https://app.nativenotify.com/api/indie/group/notification`, {
        subIDs: nearMe,
        appId: 5422,
        appToken: "LZxJt15e9Y41RHQxbR7lbx",
        title: "Nueva alerta cerca de ti!",
        message: `Se ha enviado una alerta de: ${type} en tu zona`,
      });

      const userRef = doc(db, "Areas", `${township}`);

      updateDoc(userRef, {
        [value]: arrayUnion({
          Address: addressName,
          Lat: location?.coords.latitude,
          Lng: location?.coords.longitude,
          tipo: type,
          detalles: details,
          fecha_corta: date,
          categoria: value,
        }),
      });

      // clear the input
      setDetails("");
      setType(null);
      setValue("Todos");

      Toast.show({
        type: "success",
        text1: `Alerta enviada a ${township}`,
        text2: "Gracias por tu ayuda",
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Faltan datos",
        text2: "Por favor completa todos los campos",
      });
    }
  };

  return addressName && township && dataArray ? (
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
              Agregar Alerta
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
              {/* <Card.Divider
                style={tw("mb-0 w-full mx-auto mt-3")}
                color="#59C1CC"
                width={2}
              /> */}
              <View
                style={{
                  backgroundColor: "white",
                  height: 540,
                  marginHorizontal: 40,
                  marginTop: 40,
                }}
              >
                <Text
                  style={tw(
                    "text-center text-base font-bold text-gray-500 mb-2"
                  )}
                >
                  Selecciona una categoría
                </Text>
                <View
                  style={tw(
                    "flex-row justify-between w-full px-6 font-bold border-0 mx-auto bg-gray-200 rounded-full py-2 mb-10"
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
                </View>

                <DropDownPicker
                  open={open}
                  value={type}
                  items={items}
                  setOpen={setOpen}
                  setValue={setType}
                  setItems={setItems}
                  style={[
                    tw("bg-gray-200 rounded-lg border-0 p-5 mt-5"),
                    { marginBottom: 50 },
                  ]}
                  textStyle={tw("text-gray-500 font-bold text-lg")}
                  dropDownContainerStyle={tw(
                    "bg-gray-100 rounded-lg border-0 p-3 mt-5"
                  )}
                  placeholder="Selecciona un tipo de alerta"
                />

                <DetailsField
                  label="Detalles"
                  style={[tw("font-bold text-gray-500 bg-gray-200 rounded-lg")]}
                  value={details}
                  onChangeText={(text) => setDetails(text)}
                  errorText={detailError}
                />

                <View style={{ height: 30 }} />
                <Button
                  onPress={() => {
                    WriteToDatabase();
                  }}
                  buttonStyle={tw(
                    "px-5 bg-gray-200 rounded-full w-11/12 mx-auto"
                  )}
                  style={tw(
                    "py-3 px-5 bg-gray-200 rounded-full w-11/12 mx-auto mt-28"
                  )}
                  color="white"
                  titleStyle={{ color: "gray", fontWeight: "400" }}
                >
                  Agregar alerta
                </Button>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  ) : (
    // LOADING TEXT
    <View style={tw("flex-1 justify-center items-center")}>
      <Text style={tw("text-2xl font-bold text-gray-500")}>
        Cargando información...
      </Text>
    </View>
  );
};

export default OrdersScreen;
