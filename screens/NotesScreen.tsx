import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityComponent,
  View,
} from "react-native";
import { RootStackParamList } from "../App";
import { useAppSelector } from "../state/hooks";
import { Note } from "../state/notes_slice";

type Props = NativeStackScreenProps<RootStackParamList, "Notes">;

export default function NotesScreen({ route, navigation }: Props) {
  const notes = useAppSelector((state) => state.notes);

  const editNote = (note: Note) => () => {
    if (note.locked) {
      navigation.navigate("PinInput", {
        note: note,
        purpose: "seeNote",
      });
      return;
    }
    navigation.navigate("EditingNote", {
      newNote: false,
      note: note,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Notes</Text>
      <ScrollView style={styles.scrollView}>
        {!notes.length ? (
          <Text style={styles.text}>No notes added</Text>
        ) : (
          notes.map((note) => (
            <TouchableOpacity
              key={note.id}
              style={styles.note}
              onPress={editNote(note)}
            >
              <View style={{ justifyContent: "space-evenly" }}>
                <Text style={styles.text}>{note.title}</Text>
                <Text style={styles.date}>
                  {note.date} ◦ {note.locked ? "locked" : "unlocked"}
                </Text>
              </View>
              <Text style={styles.orangeText}>Edit</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("EditingNote", {
            newNote: true,
          })
        }
      >
        <Text style={[styles.orangeText, { fontSize: 50, paddingRight: 0 }]}>
          ⊕
        </Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 40,
    fontWeight: "600",
    color: "#FF8811",
    alignSelf: "flex-start",
    marginHorizontal: "5%",
    marginBottom: "5%",
    marginTop: "5%",
  },
  note: {
    height: 70,
    width: "100%",
    borderRadius: 20,
    backgroundColor: "#101010",
    marginBottom: 10,
    paddingVertical: 10,
    flexDirection: "row",
    paddingHorizontal: "5%",
    justifyContent: "space-between",
  },
  scrollView: {
    height: "40%",
    width: "100%",
    paddingHorizontal: "3%",
  },
  text: {
    color: "#FFF8F0",
    opacity: 1,
    fontSize: 20,
    marginHorizontal: "5%",
  },
  date: {
    color: "#FFF8F0",
    opacity: 0.7,
    fontSize: 12,
    marginHorizontal: "5%",
  },
  orangeText: {
    color: "#FF8811",
    fontSize: 16,
    textAlign: "center",
    alignSelf: "center",
    paddingRight: "5%",
  },
});
