import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Card, Icon } from "@rneui/themed";
import { useTailwind } from "tailwind-rn/dist";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { TabStackParamList } from "../navigator/TabNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigator/RootNavigator";
import { getDatabase, onValue, ref } from "firebase/database";
import { auth } from "../firebase";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";

export type OrdersScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, "Nearby">,
  NativeStackNavigationProp<RootStackParamList>
>;

type Props = {
  category: any;
  type: any;
  Address: any;
  createdAt_short: any;
  Lat: any;
  trackingItems: any;
  details: any;
  Lng: any;
};

const OrderCard = ({
  category,
  type,
  Address,
  createdAt_short,
  Lat,
  trackingItems,
  details,
  Lng,
}: Props) => {
  const tw = useTailwind();
  const navigation = useNavigation<OrdersScreenNavigationProp>();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Order", {
          category,
          type,
          Address,
          createdAt_short,
          Lat,
          trackingItems,
          details,
          Lng,
        })
      }
    >
      <Card containerStyle={tw("px-5 rounded-lg border-0")}>
        <View style={tw("flex-row justify-between items-center")}>
          <View>
            {category === "Alertas" ? (
              <AntDesign
                style={tw("self-center")}
                name="warning"
                color="#59c1cc"
                size={26}
              />
            ) : category === "Emergencias" ? (
              <MaterialCommunityIcons
                style={tw("self-center")}
                name="alarm-light"
                color="#59c1cc"
                size={30}
              />
            ) : (
              <MaterialCommunityIcons
                style={tw("self-center")}
                name="road-variant"
                color="#59c1cc"
                size={30}
              />
            )}
            <Text style={{ fontSize: 10 }}>
              {new Date(createdAt_short).toLocaleDateString("es-MX", {})}
            </Text>
          </View>

          <View style={[{ maxWidth: 200 }]}>
            <Text style={[tw("text-gray-400"), { fontSize: 10 }]}>
              {category} - {type}
            </Text>
            <Text style={tw("text-gray-500 text-lg")}>{Address}</Text>
          </View>

          <View style={tw("flex-row items-center")}>
            <Text style={[tw("text-sm font-bold"), { color: "#eb6a7c" }]}>
              {new Date(createdAt_short).toLocaleTimeString("es-MX", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default OrderCard;
