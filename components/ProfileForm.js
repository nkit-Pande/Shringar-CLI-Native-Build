import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as Icon from "react-native-feather";
import { Colors } from "../color";
import { useUser } from "../context/userContext";

export default function ProfileForm({ toggleModal, userData }) {
  const [focusedField, setFocusedField] = useState("");
  const { updateUserData } = useUser();

  // State for each input field
  const [fullname, setFullname] = useState(userData.fullname || "");
  const [address, setAddress] = useState(userData.address || "");
  const [email, setEmail] = useState(userData.email || "");
  const [state, setState] = useState(userData.state || "");
  const [city, setCity] = useState(userData.city || "");
  const [country, setCountry] = useState(userData.country || "");
  const [username, setUsername] = useState(userData.username || "");
  // Function to handle form submission
  const updateInfo = () => {
    const updatedData = {
      fullname,
      email,
      username,
      address,
      city,
      state,
      country,
    };
    updateUserData(updatedData);
    toggleModal();
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View
        style={{
          height: 50,
          width: 50,
          marginTop: 10,
          marginBottom: 30,
          marginLeft: 5,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 50,
          flexDirection:'row'
        }}
      >
        <TouchableOpacity onPress={() => toggleModal()}>
          <Icon.X height={25} width={25} stroke={Colors.dark} />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === "username" && styles.focusedInput,
            ]}
            onFocus={() => setFocusedField("username")}
            onBlur={() => setFocusedField("")}
            placeholderTextColor="#ccc"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === "name" && styles.focusedInput,
            ]}
            onFocus={() => setFocusedField("name")}
            onBlur={() => setFocusedField("")}
            placeholder="John Doe"
            placeholderTextColor="#ccc"
            value={fullname}
            onChangeText={(text) => {
              setFullname(text);
            }}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === "address" && styles.focusedInput,
            ]}
            onFocus={() => setFocusedField("address")}
            onBlur={() => setFocusedField("")}
            placeholderTextColor="#ccc"
            value={address}
            onChangeText={setAddress}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === "email" && styles.focusedInput,
            ]}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField("")}
            placeholder="example@gmail.com"
            placeholderTextColor="#ccc"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Country</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === "state" && styles.focusedInput,
            ]}
            onFocus={() => setFocusedField("state")}
            onBlur={() => setFocusedField("")}
            placeholderTextColor="#ccc"
            value={country}
            onChangeText={setCountry}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>State</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === "state" && styles.focusedInput,
            ]}
            onFocus={() => setFocusedField("state")}
            onBlur={() => setFocusedField("")}
            placeholderTextColor="#ccc"
            value={state}
            onChangeText={setState}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === "city" && styles.focusedInput,
            ]}
            onFocus={() => setFocusedField("city")}
            onBlur={() => setFocusedField("")}
            placeholderTextColor="#ccc"
            value={city}
            onChangeText={setCity}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={updateInfo}>
          <Icon.Edit height={20} width={20} stroke={"white"} />
          <Text style={styles.buttonText}>Update Info</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    padding: 20,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    color: "white",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#333",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    color: "white",
  },
  focusedInput: {
    borderColor: "#007bff",
    borderWidth: 1,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    marginLeft: 5,
  },
});
