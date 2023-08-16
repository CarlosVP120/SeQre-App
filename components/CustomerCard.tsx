import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import useCustomerOrders from "../hooks/useCustomerOrders";
import { useTailwind } from "tailwind-rn/dist";
import { useNavigation } from "@react-navigation/native";
import { CustomersScreenNavigationProp } from "../screens/Areas";
import { Card, Icon } from "@rneui/themed";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";

type Props = {
  name: string;
  userId: string;
  email: string;
  publishArray: any;
};

const CustomerCard = ({ email, name, userId, publishArray }: Props) => {
  const [dataArray, setDataArray] = useState([]);

  const tw = useTailwind();
  const navigation = useNavigation<CustomersScreenNavigationProp>();

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  if (publishArray["Alertas"] === undefined) {
    publishArray["Alertas"] = [];
  } else {
    publishArray["Alertas"] = publishArray["Alertas"].filter((item: any) =>
      item.fecha_corta.includes(today)
    );
  }

  if (publishArray["Emergencias"] === undefined) {
    publishArray["Emergencias"] = [];
  } else {
    publishArray["Emergencias"] = publishArray["Emergencias"].filter(
      (item: any) => item.fecha_corta.includes(today)
    );
  }

  if (publishArray["Vialidad"] === undefined) {
    publishArray["Vialidad"] = [];
  } else {
    publishArray["Vialidad"] = publishArray["Vialidad"].filter((item: any) =>
      item.fecha_corta.includes(today)
    );
  }

  return (
    <>
      {dataArray.length >= 0 && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("MyModal", {
              name: name,
              userId: userId,
              dataArray: publishArray,
            })
          }
        >
          <Card containerStyle={tw("p-5 rounded-lg border-0")}>
            <View>
              <View style={tw("flex-col justify-between")}>
                <View style={[{ maxWidth: 300 }]}>
                  <Text style={tw("text-2xl font-bold")}>{name}</Text>
                  <Text style={[tw("text-sm"), { color: "#59C1CC" }]}>
                    ID: {userId}
                  </Text>
                </View>

                <View style={tw("flex-row items-center justify-end")}>
                  <View style={tw("flex-col items-center ")}>
                    <Text style={{ color: "#59c1cc" }}>
                      {`${publishArray["Alertas"].length}`}
                    </Text>

                    <AntDesign
                      style={tw("mb-1 ml-auto")}
                      name="warning"
                      color="#59c1cc"
                      size={26}
                    />
                  </View>
                  <View style={tw("flex-col items-center ml-2")}>
                    <Text style={{ color: "#59c1cc" }}>
                      {`${publishArray["Emergencias"].length}`}
                    </Text>

                    <MaterialCommunityIcons
                      style={tw("mb-2 ml-auto")}
                      name="alarm-light"
                      color="#59c1cc"
                      size={30}
                    />
                  </View>
                  <View style={tw("flex-col items-center ml-2")}>
                    <Text style={{ color: "#59c1cc" }}>
                      {`${publishArray["Vialidad"].length}`}
                    </Text>

                    <MaterialCommunityIcons
                      style={tw("mb-1 ml-auto")}
                      name="road-variant"
                      color="#59c1cc"
                      size={30}
                    />
                  </View>
                </View>
              </View>
            </View>
            <Card.Divider />
            <Text style={tw("text-gray-500")}>{email}</Text>
          </Card>
        </TouchableOpacity>
      )}
    </>
  );
};

export default CustomerCard;
