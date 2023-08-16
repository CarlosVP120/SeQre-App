import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Dimensions,
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
import { getDatabase, onValue, ref } from "firebase/database";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export type OrdersScreenRouteProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, "Nearby">,
  NativeStackNavigationProp<RootStackParamList, "Order">
>;

const SettingsScreen = () => {
  const navigation = useNavigation<OrdersScreenRouteProp>();

  const tw = useTailwind();

  const [orders, setOrders] = useState([]);
  const [dataArray, setDataArray] = useState([]);

  const [ascending, setAscending] = useState<boolean>(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      tabBarLabel: ({ focused, color }) => null,
    });
  }, []);

  return (
    <>
      <View style={tw("flex-1 bg-white")}>
        <ImageBackground
          source={require("../assets/inside-app.jpeg")}
          style={[
            tw("w-full"),
            { height: Dimensions.get("window").height / 1.2 },
          ]}
        >
          <View
            style={[
              tw("flex-col justify-center items-center mx-auto"),
              { marginTop: 350 },
            ]}
          >
            <Image
              source={require("../assets/logo.png")}
              style={{ width: 80, height: 40 }}
            />
            <Text
              style={tw(
                "text-white justify-center text-center text-3xl font-bold"
              )}
            >
              Cuenta
            </Text>
          </View>
        </ImageBackground>
        <View
          style={[
            tw("bg-white"),
            {
              flex: 1.5,
              bottom: 40,
              borderTopStartRadius: 40,
              borderTopEndRadius: 40,
            },
          ]}
        >
          <View style={[tw(""), { paddingTop: 10 }]}>
            <View style={{ marginTop: 10 }}>
              <Button
                onPress={() => signOut(auth)}
                buttonStyle={tw(
                  "px-5 bg-gray-200 rounded-full w-11/12 mx-auto"
                )}
                style={tw(
                  "py-3 px-5 bg-gray-200 rounded-full w-11/12 mx-auto mb-3"
                )}
                color="white"
                titleStyle={{ color: "gray", fontWeight: "400" }}
              >
                Sign Out
              </Button>

              {/* <Card.Divider
                style={tw("mb-0 w-full mx-auto mt-3")}
                color="#59C1CC"
                width={2}
              /> */}

              <ScrollView style={{ backgroundColor: "white", height: 540 }}>
                <View style={{ height: 30 }} />
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default SettingsScreen;

// copy the trackingItem
// copy the order
// change the trackingItem identifier and the trackingId of the order to something random
// change the customer_id of trackingItem
