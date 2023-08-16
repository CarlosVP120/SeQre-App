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
import TextField from "../components/TextField";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from "firebase/auth/react-native";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import { getDatabase, onValue, ref, set } from "firebase/database";
import Toast from "react-native-toast-message";
import { onSnapshot, collection, setDoc, doc } from "firebase/firestore";
import db from "../firebase";

type ModalScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

const Login = () => {
  const tw = useTailwind();
  const navigation = useNavigation<ModalScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);
  const [regionConfirmed, setRegionConfirmed] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [name, setName] = useState("");

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "594053350379-ci47vlk63479aesei0bfihhig08pegjj.apps.googleusercontent.com",
  });

  const WriteToDatabase = () => {
    set(ref(getDatabase(auth.app), `/customers/${auth.currentUser?.uid}`), {
      email: auth.currentUser?.email,
      name: auth.currentUser?.displayName,
      regionConfirmed: false,
    });
  };

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
              setUserExists(true);
              setName(data.name);
              if (data.regionConfirmed === true) {
                showToast();
                navigation.navigate("Main");
                setRegionConfirmed(true);
              } else if (data.regionConfirmed === false) {
                navigation.navigate("RegionSelect");
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
    authListener();
  }, [response]);

  const authListener = () => {
    onAuthStateChanged(auth, (user) => {
      if (user && regionConfirmed && userExists) {
        showToast();
        navigation.navigate("Main");
      } else if (user && !regionConfirmed && userExists) {
        navigation.navigate("RegionSelect");
      } else if (user && !userExists) {
        onValue(
          ref(getDatabase(auth.app), `/customers/${auth.currentUser?.uid}`),
          (snapshot) => {
            const data = snapshot.val();
            if (data) {
              setUserExists(true);
              setName(data.name);
              if (data.regionConfirmed === true) {
                showToast();
                navigation.navigate("Main");
                setRegionConfirmed(true);
              } else if (data.regionConfirmed === false) {
                navigation.navigate("RegionSelect");
              }
            }
          }
        );
      } else {
        navigation.navigate("Login");
      }
    });
  };

  // useEffect(() => {
  //   if (response?.type === "success") {
  //     const { id_token } = response.params;
  //     const credential = GoogleAuthProvider.credential(id_token);
  //     if (auth.currentUser) {
  //       onSnapshot(collection(db, "customers"), (snapshot) => {
  //         snapshot.forEach((doc) => {
  //           if (doc.id === auth.currentUser?.uid) {
  //             setUserExists(true);
  //             setName(doc.data().name);
  //             if (doc.data().regionConfirmed === true) {
  //               showToast();
  //               navigation.navigate("Main");
  //               setRegionConfirmed(true);
  //             } else if (doc.data().regionConfirmed === false) {
  //               navigation.navigate("RegionSelect");
  //             }
  //           } else {
  //             navigation.navigate("RegionSelect");
  //             WriteToDatabase();
  //           }
  //         });
  //       });
  //     }
  //     signInWithCredential(auth, credential);
  //   }
  //   authListener();
  // }, [response]);

  // const authListener = () => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user && regionConfirmed && userExists) {
  //       showToast();
  //       navigation.navigate("Main");
  //     } else if (user && !regionConfirmed && userExists) {
  //       navigation.navigate("RegionSelect");
  //     } else if (user && !userExists) {
  //       console.log("User Does Not Exist");
  //       onSnapshot(collection(db, "customers"), (snapshot) => {
  //         snapshot.forEach((doc) => {
  //           if (doc.id === auth.currentUser?.uid) {
  //             console.log("doc.id === auth.currentUser?.uid");
  //             setUserExists(true);
  //             setName(doc.data().name);
  //             if (doc.data().regionConfirmed === true) {
  //               console.log("doc.data().regionConfirmed === true");
  //               showToast();
  //               navigation.navigate("Main");
  //               setRegionConfirmed(true);
  //             } else if (doc.data().regionConfirmed === false) {
  //               console.log("doc.data().regionConfirmed === false");
  //               navigation.navigate("RegionSelect");
  //             }
  //           } else {
  //             console.log("else");
  //           }
  //         });
  //       });
  //     } else {
  //       console.log("Login");
  //       navigation.navigate("Login");
  //     }
  //   });
  // };

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, pass)
      .then(() => {
        showToast();
        navigation.navigate("Main");
        setEmail("");
        setPass("");
        // console.log(auth.currentUser?.uid);
      })
      .catch((error) => {
        if (error.code === "auth/wrong-password") {
          setPassError("Wrong password");
        } else if (error.code === "auth/invalid-email") {
          setEmailError("That email address is invalid!");
        } else if (error.code === "auth/user-not-found") {
          setEmailError("User not found");
        } else {
          Alert.alert("Error", error.message);
        }
      });
  };

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: `Welcome back! ${
        auth.currentUser?.displayName || auth.currentUser?.email?.split("@")[0]
      }`,
      text2: "Login successful",
    });
  };

  return (
    <>
      <View style={tw("flex-1 bg-white")}>
        <ImageBackground
          source={require("../assets/background.webp")}
          style={[
            tw("w-full"),
            { height: Dimensions.get("window").height / 2.5 },
          ]}
        >
          <View style={tw("flex-1 justify-center items-center")}>
            <Image
              source={require("../assets/logo.png")}
              style={{ width: 80, height: 40 }}
            />
            <Text style={tw("text-white text-4xl font-bold mt-5")}>
              SeQreApp
            </Text>
            <Text style={tw("text-white text-base")}>
              Please login to continue
            </Text>
          </View>
        </ImageBackground>
        <View
          style={[
            tw("bg-white"),
            {
              flex: 1.5,
              bottom: 50,
              borderTopStartRadius: 40,
              borderTopEndRadius: 40,
            },
          ]}
        >
          <View style={[tw(""), { padding: 40 }]}>
            <Text style={[tw("font-bold"), { color: "#4632A1", fontSize: 34 }]}>
              Welcome
            </Text>
            <Text>
              Don't have an account?{" "}
              <Text
                style={tw("text-blue-500 italic underline")}
                onPress={() => navigation.navigate("Register")}
              >
                Register Now
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
            </View>
            <View style={tw("flex-row justify-end mt-6")}>
              <Text
                style={tw("text-blue-500 italic underline mb-10")}
                onPress={() => {
                  if (!email) {
                    setEmailError("Email is required");
                    Alert.alert("Reset Password", "Email is required");
                  } else if (!email.includes("@")) {
                    setEmailError("Email is not valid");
                    Alert.alert("Reset Password", "Email is not valid");
                  } else if (emailError == null && email.length > 0) {
                    Alert.alert("Reset Password", `Email sent to ${email}`);
                    sendPasswordResetEmail(auth, email);
                  }
                }}
              >
                Forgot Password?
              </Text>
            </View>

            <View
              style={{
                height: 100,
                justifyContent: "center",
                alignItems: "center",
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
                    email.length > 0 &&
                    pass.length > 0
                  ) {
                    handleSignIn();
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
                Login
              </Button>
              <View style={[tw("justify-center mt-7")]}>
                <Text style={tw("text-gray-500 mb-4")}>Or Login with</Text>
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
    </>
  );
};

export default Login;
