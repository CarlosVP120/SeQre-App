import { View, Text } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTailwind } from "tailwind-rn/dist";
import { Card, Icon, Divider } from "@rneui/themed";
import MapView, { Circle, Marker } from "react-native-maps";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import * as Location from "expo-location";

type Props = {
  category: any;
  type: any;
  Address: any;
  createdAt_short: any;
  Lat: any;
  trackingItems: any;
  details: any;
  Lng: any;
  fullWidth?: boolean;
};

const DeliveryCard = ({
  category,
  type,
  createdAt_short,
  details,
  Lat,
  Lng,
  fullWidth,
  Address,
}: Props) => {
  const tw = useTailwind();
  const [address, setAddress] = React.useState("");

  useEffect(() => {
    (async () => {
      let address = await Location.reverseGeocodeAsync({
        latitude: Lat,
        longitude: Lng,
      });
      setAddress(address[0].street + " " + address[0].streetNumber);
    })();
  }, []);

  const date = new Date(createdAt_short).toLocaleString("es-MX", {
    dateStyle: "full",
    timeStyle: "short",
  });

  let markerRef = useRef(null);

  let mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      // @ts-ignore
      mapRef.current.animateToRegion({
        latitude: Lat,
        longitude: Lng,
        latitudeDelta: 0.0025,
        longitudeDelta: 0.0025,
      });

      if (markerRef.current && fullWidth) {
        // @ts-ignore
        markerRef.current.showCallout();
      }
    }
  });

  return (
    <Card
      containerStyle={[
        tw(`${fullWidth ? "rounded-none -m-2" : "rounded-lg my-2"}`),
        {
          backgroundColor: fullWidth ? "#EB6A7C" : "#59C1CC",
          padding: 0,
          paddingTop: 16,
          shadowColor: "black",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
      ]}
    >
      <View style={fullWidth && { height: "100%", paddingTop: "5%" }}>
        {category === "Alertas" ? (
          <AntDesign
            name="warning"
            color="white"
            size={50}
            style={tw("self-center")}
          />
        ) : category === "Emergencias" ? (
          <MaterialCommunityIcons
            name="alarm-light"
            color="white"
            size={50}
            style={tw("self-center")}
          />
        ) : category === "Vialidad" ? (
          <MaterialCommunityIcons
            name="road-variant"
            color="white"
            size={50}
            style={tw("self-center")}
          />
        ) : (
          <Icon name="box" type="entypo" color="white" size={50} />
        )}
        <View style={tw("items-start p-5 pb-2 -mt-3")}>
          <View style={tw("mx-auto")}>
            <Text
              style={tw("text-xs text-center uppercase text-white font-bold")}
            >
              {category} - {type}
            </Text>
            <Text
              style={tw(
                "text-white text-center uppercase text-lg font-bold mt-3"
              )}
            >
              {date}
            </Text>
            <Divider color="white" />
          </View>
          <View style={tw("mx-auto mb-5")}>
            <Text style={tw("text-base text-center text-white font-bold mt-5")}>
              Ubicación
            </Text>
            <Text style={tw("text-sm text-center text-white mb-4")}>
              {Address}
            </Text>
            <Text style={tw("text-base text-center text-white font-bold")}>
              Detalles
            </Text>
            <Text style={tw("text-sm text-center text-white mb-6")}>
              {details}
            </Text>
            <Divider color="white" />
            <Text style={tw("text-sm text-center italic text-white mt-1")}>
              Tome sus precauciones
            </Text>
          </View>
        </View>
        <Divider color="white" />
        {Lat && Lng && (
          <>
            <MapView
              initialRegion={{
                latitude: Lat,
                longitude: Lng,
                latitudeDelta: 0.0025,
                longitudeDelta: 0.0025,
              }}
              style={[
                tw("w-full"),
                { flexGrow: 1 },
                !fullWidth && { height: 200 },
              ]}
              showsUserLocation={true}
              ref={mapRef}
            >
              <Marker
                ref={markerRef}
                coordinate={{ latitude: Lat, longitude: Lng }}
                title={type}
                description={Address}
                identifier="destination"
              />
              <Circle
                center={{ latitude: Lat, longitude: Lng }}
                radius={80}
                fillColor={"rgba(51, 153, 255,0.2)"}
                strokeColor={"rgba(51, 153, 255,0.8)"}
              />
            </MapView>
          </>
        )}
      </View>
    </Card>
  );
};

export default DeliveryCard;
