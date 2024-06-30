import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/CategoryScreen";
import LoginScreen from "./screens/Login/LoginScreen";
import SignUpScreen from "./screens/SignUp/SignUpScreen";
import SplashScreen from "./screens/SplashScreen";
import BoardingScreen from "./screens/BoardingScreen";
import ItemDescription from "./screens/ItemDescription";
import StarterScreen from "./screens/StarterScreen";
import { UserProvider } from "./context/userContext";
import { ProductProvider } from "./context/productContext";
import { WishlistProvider } from "./context/wishlistContext";
import { CartProvider } from "./context/cartContext";
import { ToastProvider } from 'react-native-toast-notifications';
import WelcomeScreen from "./screens/WelcomeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ToastProvider>
      <UserProvider>
        <CartProvider>
          <WishlistProvider>
            <ProductProvider>
              <NavigationContainer>
                <Stack.Navigator
                  initialRouteName="Splash"
                  screenOptions={{
                    headerShown: false,
                  }}
                >
                  <Stack.Screen name="Boarding" component={BoardingScreen} />
                  <Stack.Screen name="Splash" component={SplashScreen} />
                  <Stack.Screen name="Welcome" component={WelcomeScreen} />
                  <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ animation: "slide_from_right" }}
                  />
                  <Stack.Screen
                    name="ItemDescription"
                    component={ItemDescription}
                    options={{ animation: "slide_from_bottom" }}
                  />
                  <Stack.Screen name="SignUp" component={SignUpScreen} options={{ animation: "slide_from_left" }}/>
                  <Stack.Screen name="Starter" component={StarterScreen} />
                </Stack.Navigator>
              </NavigationContainer>
            </ProductProvider>
          </WishlistProvider>
        </CartProvider>
      </UserProvider>
    </ToastProvider>
  );
}


