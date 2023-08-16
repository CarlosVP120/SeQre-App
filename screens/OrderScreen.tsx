import { View, Text, StatusBar } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useTailwind } from "tailwind-rn/dist";
import {
  CompositeNavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { TabStackParamList } from "../navigator/TabNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigator/RootNavigator";
import DeliveryCard from "../components/DeliveryCard";

type OrderScreenRouteProp = RouteProp<RootStackParamList, "Order">;

type OrdersScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, "Nearby">,
  NativeStackNavigationProp<RootStackParamList>
>;

const OrderScreen = () => {
  const tw = useTailwind();
  const navigation = useNavigation<OrdersScreenNavigationProp>();

  const {
    params: {
      category,
      type,
      Address,
      createdAt_short,
      Lat,
      trackingItems,
      details,
      Lng,
    },
  } = useRoute<OrderScreenRouteProp>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: new Date(createdAt_short).toLocaleString("es-MX", {
        dateStyle: "short",
        timeStyle: "short",
      }),
    });
  }, []);

  return (
    <View style={tw("-mt-2")}>
      {/* <View>
        <StatusBar translucent barStyle="dark-content" />
      </View> */}
      <DeliveryCard
        category={category}
        type={type}
        Address={Address}
        createdAt_short={createdAt_short}
        Lat={Lat}
        trackingItems={trackingItems}
        details={details}
        Lng={Lng}
        fullWidth
      />
    </View>
  );
};

export default OrderScreen;
