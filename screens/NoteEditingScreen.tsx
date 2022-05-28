import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../App";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { addNote, editNote } from "../state/notes_slice";

type Props = NativeStackScreenProps<RootStackParamList, "EditingNote">;

export default function NoteEditingScreen({ route, navigation }: Props) {
  const ref_input2 = useRef(null);
  const newNote = route.params.newNote;

  const notes = useAppSelector((state) => state.notes);
  const note = useAppSelector((state) => state.notes).find(
    (note) => note.id === route.params.note?.id
  );
  const lockData = useAppSelector((state) => state.lock);
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState(
    note?.title || "Note " + (notes.length + 1)
  );
  const [body, setBody] = useState(note?.body || "");
  const [locked, setLocked] = useState(note?.locked || false);

  const goBackToNotes = () => {
    saveNote();
    navigation.popToTop();
  };

  const saveNote = () => {
    if (newNote) {
      const noteToAdd = {
        id: notes.length + 1,
        title: title,
        body: body,
        date: new Date().toISOString().slice(0, 10),
        locked: locked,
      };
      dispatch(addNote(noteToAdd));
      return;
    }
    const noteToEdit = {
      id: note?.id || notes.length + 1,
      title: title,
      body: body,
      date: new Date().toISOString().slice(0, 10),
      locked: locked,
    };
    dispatch(editNote(noteToEdit));
  };

  const handleLockPress = () => {
    if (locked) {
      navigation.navigate("PinInput", { note: note, purpose: "unlockNote" });
      return;
    }
    if (!lockData.pinCode) {
      navigation.navigate("PinInput", { note: note, purpose: "creatingPin" });
      return;
    }
    setLocked(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <TouchableOpacity style={{ margin: "5%" }} onPress={goBackToNotes}>
          <Text style={[styles.orangeText]}>⇦ Notes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ margin: "5%" }} onPress={handleLockPress}>
          <Text style={[styles.orangeText]}>{locked ? "Unlock" : "Lock"}</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        numberOfLines={4}
        style={{
          fontSize: 40,
          fontWeight: "600",
          color: "#FFF8F0",
          alignSelf: "flex-start",
          marginHorizontal: "5%",
        }}
        selectionColor="#FF8811"
        placeholder="Note title"
        value={title}
        onChangeText={setTitle}
      />
      <ScrollView
        style={{
          backgroundColor: "#000000",
          borderBottomWidth: 1,
          height: "20%",
          width: "100%",
          paddingVertical: "5%",
          borderRadius: 10,
        }}
      >
        <TextInput
          numberOfLines={4}
          multiline
          style={{
            paddingHorizontal: "5%",
            paddingVertical: "10%",
            color: "#FFF8F0",
            fontSize: 20,
          }}
          selectionColor="#FF8811"
          ref={ref_input2}
          value={body}
          onChangeText={setBody}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  orangeText: {
    color: "#FF8811",
    fontSize: 18,
    paddingRight: "5%",
  },
});
