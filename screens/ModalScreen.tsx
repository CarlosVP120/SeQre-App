import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Icon } from "@rneui/themed";
import { useTailwind } from "tailwind-rn/dist";
import {
  CompositeNavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { TabStackParamList } from "../navigator/TabNavigator";
import { RootStackParamList } from "../navigator/RootNavigator";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useCustomerOrders from "../hooks/useCustomerOrders";
import DeliveryCard from "../components/DeliveryCard";
import { getDatabase, onValue, ref } from "firebase/database";
import { auth } from "../firebase";

type ModalScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, "Areas">,
  NativeStackNavigationProp<RootStackParamList, "MyModal">
>;

type ModalScreenRouteProp = RouteProp<RootStackParamList, "MyModal">;

const ModalScreen = () => {
  const tw = useTailwind();
  const navigation = useNavigation<ModalScreenNavigationProp>();
  const {
    params: { name, userId, dataArray },
  } = useRoute<ModalScreenRouteProp>();

  // put together the object in dataArray["Alertas"] with the object in dataArray["Emergencias"] and return the result in one array
  const mergedArray = dataArray["Alertas"].concat(
    dataArray["Emergencias"].concat(dataArray["Vialidad"])
  );

  const [filter, setFilter] = useState("");
  const [ascending, setAscending] = useState<boolean>(false);

  mergedArray.sort((a: any, b: any) => {
    // @ts-ignore
    return new Date(b["fecha_corta"]) - new Date(a["fecha_corta"]);
  });

  dataArray["Alertas"].sort((a: any, b: any) => {
    // @ts-ignore
    return new Date(b["fecha_corta"]) - new Date(a["fecha_corta"]);
  });

  dataArray["Emergencias"].sort((a: any, b: any) => {
    // @ts-ignore
    return new Date(b["fecha_corta"]) - new Date(a["fecha_corta"]);
  });

  dataArray["Vialidad"].sort((a: any, b: any) => {
    // @ts-ignore
    return new Date(b["fecha_corta"]) - new Date(a["fecha_corta"]);
  });

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
            {name}
          </Text>
          <Text style={[tw("text-center italic text-sm"), {}]}>
            Publicaciones
          </Text>
        </View>
      </View>

      <View
        style={[
          tw("flex-row bg-gray-100 p-2 w-full justify-between"),
          { borderBottomColor: "#59c1cc", borderBottomWidth: 1 },
        ]}
      >
        <TouchableOpacity
          style={tw(
            `flex-row justify-center items-center rounded-lg bg-gray-200 py-2 w-1/4 border-gray-400`
          )}
          onPress={() => {
            setFilter("Alertas");
          }}
        >
          <Text
            style={tw(
              `text-sm font-bold ${filter === "Alertas" ? "text-blue-500" : ""}`
            )}
          >
            Alertas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw(
            `flex-row justify-center items-center rounded-lg bg-gray-200 py-2 w-1/4 border-gray-400`
          )}
          onPress={() => {
            setFilter("Emergencias");
          }}
        >
          <Text
            style={tw(
              `text-sm font-bold ${
                filter === "Emergencias" ? "text-blue-500" : ""
              }`
            )}
          >
            Emergencias
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw(
            `flex-row justify-center items-center rounded-lg bg-gray-200 py-2 w-1/4 border-gray-400`
          )}
          onPress={() => {
            setFilter("Vialidad");
          }}
        >
          <Text
            style={tw(
              `text-sm font-bold ${
                filter === "Vialidad" ? "text-blue-500" : ""
              }`
            )}
          >
            Vialidad
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw(
            "flex-row justify-center items-center rounded-lg bg-gray-200 py-2 w-1/6 border-gray-400"
          )}
          onPress={() => {
            setFilter("");
          }}
        >
          <Text
            style={tw(
              `text-sm font-bold ${filter === "" ? "text-blue-500" : ""}`
            )}
          >
            Todos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Re-load the component when the filter changes */}

      {filter === "" ? (
        <FlatList
          contentContainerStyle={{ paddingBottom: 200 }}
          data={mergedArray}
          renderItem={({ item }) => (
            <DeliveryCard
              key={item["id"]}
              type={item["tipo"]}
              category={item["categoria"]}
              details={item["detalles"]}
              Address={item["Address"]}
              createdAt_short={item["fecha_corta"]}
              Lng={item["Lng"]}
              Lat={item["Lat"]}
              trackingItems={[]}
            />
          )}
        />
      ) : filter === "Alertas" ? (
        <FlatList
          contentContainerStyle={{ paddingBottom: 200 }}
          data={dataArray["Alertas"]}
          renderItem={({ item }) => (
            <DeliveryCard
              key={item["id"]}
              type={item["tipo"]}
              category={item["categoria"]}
              details={item["detalles"]}
              Address={item["Address"]}
              createdAt_short={item["fecha_corta"]}
              Lng={item["Lng"]}
              Lat={item["Lat"]}
              trackingItems={[]}
            />
          )}
        />
      ) : filter === "Emergencias" ? (
        <FlatList
          contentContainerStyle={{ paddingBottom: 200 }}
          data={dataArray["Emergencias"]}
          renderItem={({ item }) => (
            <DeliveryCard
              key={item["id"]}
              type={item["tipo"]}
              category={item["categoria"]}
              details={item["detalles"]}
              Address={item["Address"]}
              createdAt_short={item["fecha_corta"]}
              Lng={item["Lng"]}
              Lat={item["Lat"]}
              trackingItems={[]}
            />
          )}
        />
      ) : filter === "Vialidad" ? (
        <FlatList
          contentContainerStyle={{ paddingBottom: 200 }}
          data={dataArray["Vialidad"]}
          renderItem={({ item }) => (
            <DeliveryCard
              key={item["id"]}
              type={item["tipo"]}
              category={item["categoria"]}
              details={item["detalles"]}
              Address={item["Address"]}
              createdAt_short={item["fecha_corta"]}
              Lng={item["Lng"]}
              Lat={item["Lat"]}
              trackingItems={[]}
            />
          )}
        />
      ) : (
        <Text>Nothing to show</Text>
      )}

      {/* <FlatList
        contentContainerStyle={{ paddingBottom: 200 }}
        data={mergedArray}
        renderItem={({ item }) => (
          <DeliveryCard
            key={item["id"]}
            type={item["tipo"]}
            category={item["category"]
            details={item["detalles"]}
            Address={item["id"]}
            createdAt_short={item["id"]}
            Lng={item["Lng"]}
            Lat={item["Lat"]}
            trackingItems={[]}
          />
        )}
      /> */}
    </View>
  );
};

export default ModalScreen;
