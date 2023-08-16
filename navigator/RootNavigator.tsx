import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import ModalScreen from "../screens/ModalScreen";
import OrderScreen from "../screens/OrderScreen";
import NewDataScreen from "../screens/NewPublishScreen";
import Login from "../screens/Login";
import Register from "../screens/Register";
import RegionSelect from "../screens/RegionSelect";

export type RootStackParamList = {
  Main: undefined;
  MyModal: { userId: string; name: string; dataArray: any };
  Order: {
    category: any;
    type: any;
    Address: any;
    createdAt_short: any;
    Lat: any;
    trackingItems: any;
    details: any;
    Lng: any;
  };
  NewData: undefined;
  Login: undefined;
  Register: undefined;
  RegionSelect: undefined;
};

const RootNavigator = () => {
  const RootStack = createNativeStackNavigator<RootStackParamList>();

  return (
    <RootStack.Navigator>
      <RootStack.Group>
        <RootStack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="Login"
          component={Login}
        />
        <RootStack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="Register"
          component={Register}
        />
        <RootStack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="RegionSelect"
          component={RegionSelect}
        />
      </RootStack.Group>

      <RootStack.Group>
        <RootStack.Screen
          name="Main"
          component={TabNavigator}
          options={{ gestureEnabled: false }}
        />
      </RootStack.Group>

      <RootStack.Group
        screenOptions={{
          presentation: "modal",
        }}
      >
        <RootStack.Screen
          options={{ headerShown: false }}
          name="MyModal"
          component={ModalScreen}
        />
      </RootStack.Group>

      <RootStack.Group
      // screenOptions={{
      //   presentation: "modal",
      // }}
      >
        <RootStack.Screen
          name="Order"
          component={OrderScreen}
          options={{
            headerStyle: {
              backgroundColor: "#EB6A7C",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
      </RootStack.Group>

      <RootStack.Group
        screenOptions={{
          presentation: "modal",
        }}
      >
        <RootStack.Screen
          name="NewData"
          component={NewDataScreen}
          options={{ headerShown: false }}
        />
      </RootStack.Group>
    </RootStack.Navigator>
  );
};

export default RootNavigator;
