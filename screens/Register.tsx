import {
  View,
  Text,
  ScrollView,
  Alert,
  ImageBackground,
  Dimensions,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Card, Icon, Image, Button } from "@rneui/themed";
import { useTailwind } from "tailwind-rn/dist";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { TabStackParamList } from "../navigator/TabNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigator/RootNavigator";
import { FloatingLabelInput } from "react-native-floating-label-input";
import Animated from "react-native-reanimated";
import TextField from "../components/TextField";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";
import { auth } from "../firebase";
import * as Google from "expo-auth-session/providers/google";
import { getDatabase, onValue, ref, set } from "firebase/database";

type ModalScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

const Register = () => {
  const tw = useTailwind();
  const navigation = useNavigation<ModalScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);
  const [confirmPassError, setConfirmPassError] = useState<string | null>(null);

  const handleCreateUser = () => {
    createUserWithEmailAndPassword(auth, email, pass)
      .then(() => {
        navigation.navigate("RegionSelect");
        WriteToDatabase();
        // console.log(auth.currentUser?.uid);
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          setEmailError("That email address is already in use!");
        } else if (error.code === "auth/invalid-email") {
          setEmailError("That email address is invalid!");
        } else if (error.code === "auth/weak-password") {
          setPassError("Password must be at least 6 characters");
        } else {
          Alert.alert("Error", error.message);
        }
      });
  };

  const WriteToDatabase = () => {
    set(ref(getDatabase(auth.app), `/customers/${auth.currentUser?.uid}`), {
      email: auth.currentUser?.email,
      name: auth.currentUser?.displayName || email.split("@")[0],
      regionConfirmed: false,
    });
  };

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "594053350379-ci47vlk63479aesei0bfihhig08pegjj.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      if (auth.currentUser) {
        onValue(
          ref(getDatabase(auth.app), `/customers/${auth.currentUser?.uid}`),
          (snapshot) => {
            const data = snapshot.val();
            if (data) {
              if (data.regionConfirmed === true) {
                navigation.navigate("Main");
              }
            } else {
              navigation.navigate("RegionSelect");
              WriteToDatabase();
            }
          }
        );
      }
      signInWithCredential(auth, credential);
    }
  }, [response]);

  return (
    <View style={tw("flex-1 bg-white")}>
      <ImageBackground
        source={require("../assets/background.webp")}
        style={[
          tw("w-full"),
          { height: Dimensions.get("window").height / 2.5 },
        ]}
      >
        <View style={tw("flex-row justify-center items-center mt-20 mx-auto")}>
          <Image
            source={require("../assets/logo.png")}
            style={{ width: 80, height: 40, marginRight: 10 }}
          />
          <Text
            style={tw(
              "text-white justify-center text-center text-3xl font-bold"
            )}
          >
            SeQreApp
          </Text>
        </View>
      </ImageBackground>
      <View
        style={[
          tw("bg-white"),
          {
            flex: 1.5,
            bottom: 200,
            borderTopStartRadius: 40,
            borderTopEndRadius: 40,
          },
        ]}
      >
        <View style={[tw(""), { padding: 40 }]}>
          <Text style={[tw("font-bold"), { color: "#4632A1", fontSize: 34 }]}>
            Register
          </Text>
          <Text>
            Already have an account?{" "}
            <Text
              style={tw("text-blue-500 italic underline")}
              onPress={() => navigation.navigate("Login")}
            >
              Login
            </Text>
          </Text>

          <View style={{ marginTop: 30 }}>
            <TextField
              label="Email*"
              style={tw("font-bold text-gray-500")}
              value={email}
              onChangeText={(text) => setEmail(text)}
              errorText={emailError}
              onBlur={() => {
                if (email.length == 0) {
                  setEmailError("Email is required");
                } else if (!email.includes("@")) {
                  setEmailError("Email is not valid");
                } else {
                  setEmailError(null);
                }
              }}
            />
            <TextField
              style={tw("font-bold mt-5 text-gray-500")}
              label="Password*"
              secureTextEntry={true}
              value={pass}
              onChangeText={(text) => setPass(text)}
              errorText={passError}
              onBlur={() => {
                if (pass.length == 0) {
                  setPassError("Password is required");
                } else if (pass.length < 6) {
                  setPassError("Password must be at least 6 characters");
                } else {
                  setPassError(null);
                }
              }}
            />
            <TextField
              style={tw("font-bold mt-5 text-gray-500")}
              label="Confirm Password*"
              secureTextEntry={true}
              value={confirmPass}
              onChangeText={(text) => setConfirmPass(text)}
              errorText={confirmPassError}
              onBlur={() => {
                if (confirmPass != pass) {
                  setConfirmPassError("Passwords are not the same");
                } else {
                  setConfirmPassError(null);
                }
              }}
            />
          </View>

          <View
            style={{
              height: 100,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 100,
            }}
          >
            <Button
              onPress={() => {
                if (!email || !pass) {
                  if (!email && !pass) {
                    setEmailError("Email is required");
                    setPassError("Password is required");
                  } else if (!email) {
                    setEmailError("Email is required");
                  } else if (!pass) {
                    setPassError("Password is required");
                  }
                } else if (
                  emailError == null &&
                  passError == null &&
                  confirmPassError == null &&
                  email.length > 0 &&
                  pass.length > 0 &&
                  confirmPass.length > 0
                ) {
                  handleCreateUser();
                }
              }}
              style={[
                tw("py-2 px-5 rounded-full "),
                { backgroundColor: "#4632A1", width: "100%" },
              ]}
              color="#4632A1"
              titleStyle={{ color: "white", fontWeight: "bold" }}
              containerStyle={tw("pb-0 rounded-full w-3/4 mx-0 mt-10")}
            >
              Register
            </Button>
            <View style={[tw("justify-center mt-7")]}>
              <Text style={tw("text-gray-500 mb-4")}>Or Register with</Text>
              <View style={tw("flex-row justify-center")}>
                <Icon
                  name="google"
                  type="font-awesome"
                  color="#db3236"
                  size={45}
                  containerStyle={tw("mx-2")}
                  onPress={() => {
                    promptAsync();
                  }}
                  style={tw("border-red-500 border rounded-full p-2 px-3")}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Register;
