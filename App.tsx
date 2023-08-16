import { StyleSheet, Text, View } from "react-native";
import { TailwindProvider } from "tailwind-rn";
import CustomersScreen from "./screens/Areas";
import utilities from "./tailwind.json";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RootNavigator from "./navigator/RootNavigator";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";
// @ts-ignore - TailwindProvider is missing a type definition
import AnimatedSplash from "react-native-animated-splash-screen";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import registerNNPushToken from "native-notify";

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  registerNNPushToken(5422, "LZxJt15e9Y41RHQxbR7lbx");

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 1500);
  }, []);

  return (
    // @ts-ignore - TailwindProvider is missing a type definition
    <TailwindProvider utilities={utilities}>
      <AnimatedSplash
        translucent={true}
        isLoaded={isLoaded}
        logoImage={require("./assets/logo.png")}
        backgroundColor={"#262626"}
        logoHeight={150}
        logoWidth={150}
      >
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AnimatedSplash>
      <Toast />
    </TailwindProvider>
  );
}
