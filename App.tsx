import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StatusBar } from "react-native";
import NoteEditingScreen from "./screens/NoteEditingScreen";
import NotesScreen from "./screens/NotesScreen";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { store } from "./state/store";
import { Note } from "./state/notes_slice";
import { InputPurpose } from "./state/lock_slice";
import PinInputScreen from "./screens/PinInputScreen";

export type RootStackParamList = {
  Notes: undefined;
  EditingNote: { newNote: boolean; note?: Note };
  PinInput: { purpose: InputPurpose; note?: Note };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Notes"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Notes" component={NotesScreen} />
      <Stack.Screen name="EditingNote" component={NoteEditingScreen} />
      <Stack.Screen name="PinInput" component={PinInputScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar barStyle={"light-content"} />
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </Provider>
  );
}
