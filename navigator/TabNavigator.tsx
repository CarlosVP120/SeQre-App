import { View, Text } from "react-native";
import React, { useLayoutEffect } from "react";
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

export type TabStackParamList = {
  Areas: undefined;
  Nearby: undefined;
  New: undefined;
  Settings: undefined;
};

type MainScreenRouteProp = RouteProp<RootStackParamList, "Login">;

const Tab = createBottomTabNavigator<TabStackParamList>();

const TabNavigator = () => {
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
        component={CustomersScreen}
      />
      <Tab.Screen
        name="Nearby"
        options={{ tabBarLabel: () => null }}
        component={OrdersScreen}
      />
      <Tab.Screen
        name="New"
        options={{ tabBarLabel: () => null }}
        component={MyPublishes}
      />
      <Tab.Screen
        name="Settings"
        options={{ tabBarLabel: () => null }}
        component={Settings}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
