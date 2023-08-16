import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import {
  CompositeNavigationProp,
  RouteProp,
  useNavigation,
} from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { TabStackParamList } from "../navigator/TabNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigator/RootNavigator";
import { Button, Card, Icon, Image } from "@rneui/themed";
import { useTailwind } from "tailwind-rn/dist";

type NewScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, "New">,
  NativeStackNavigationProp<RootStackParamList, "NewData">
>;

type NewScreenRouteProp = RouteProp<RootStackParamList, "NewData">;

const NewDataScreen = () => {
  const tw = useTailwind();
  const navigation = useNavigation<NewScreenNavigationProp>();

  return (
    <View>
      <TouchableOpacity
        onPress={navigation.goBack}
        style={tw("absolute right-5 top-5 z-10")}
      >
        <Icon name="closecircle" type="antdesign" />
      </TouchableOpacity>

      <View style={{ marginTop: 10 }}>
        <View style={[tw("py-5 border-b"), { borderColor: "#59c1cc" }]}>
          <Text
            style={[tw("text-center text-xl font-bold"), { color: "#59c1cc" }]}
          >
            Add New Data
          </Text>
          <Text style={[tw("text-center italic text-sm"), {}]}>
            Please fill the form
          </Text>
        </View>
      </View>
    </View>
  );
};

export default NewDataScreen;
