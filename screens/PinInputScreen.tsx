import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  Alert,
  GestureResponderEvent,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../App";
import { authenticate1 } from "../calculations/classifiers";
import PinCircle from "../components/PinCircle";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import {
  addPin,
  addTrainingStepData,
  InputData,
  KeyPressData,
  PressEventType,
} from "../state/lock_slice";
import { editNote, Note } from "../state/notes_slice";

export type PhaseType = "training" | "login" | "creatingPin";

type Props = NativeStackScreenProps<RootStackParamList, "PinInput">;

export default function PinInputScreen({ route, navigation }: Props) {
  const THRESHOLD = 2.7;
  const PIN_LENGTH = 6;
  const TRAINING_STEPS = 8;
  const dispatch = useAppDispatch();
  const [phase, setPhase] = useState(route.params.purpose);

  const lockData = useAppSelector((state) => state.lock);
  const inputDataInit: InputData = {
    input: "",
    purpose: phase === "training" ? "training" : "seeNote",
    data: [],
  };

  useEffect(() => {
    setPhase(route.params.purpose);
  }, [route.params.purpose]);

  const note = route.params.note;

  const pinCircleSize = "large";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = React.useState(false);
  const [trainingStep, setTrainingStep] = React.useState(1);
  const [passcode, setPasscode] = useState<Array<string>>(
    Array(PIN_LENGTH).join(".").split(".")
  );

  useEffect(() => {
    setCurrentIndex(0);
    setPasscode(Array(PIN_LENGTH).join(".").split("."));
  }, [phase]);

  const enterSymbol = (key: string) => () => {
    const pass = [...passcode];
    pass[currentIndex] = key;
    setPasscode(pass);
    setError(false);
    if (currentIndex + 1 === PIN_LENGTH) {
      if (phase === "creatingPin") {
        // save pin
        dispatch(addPin(passcode.join("") + key));
        // navigate to training
        navigation.navigate("PinInput", {
          purpose: "training",
          note: note,
        });
      }
    }
    setCurrentIndex(currentIndex + 1);
  };

  const validatePasscode = (passcode: string) => {
    return lockData?.pinCode === passcode;
  };

  const clearInput = () => {
    setCurrentIndex(0);
    setPasscode(Array(PIN_LENGTH).join(".").split("."));
    setInputData(inputDataInit);
  };

  const getDescription = () => {
    switch (route.params.purpose) {
      case "creatingPin": {
        return "Create new passcode.";
      }
      case "seeNote": {
        return "To see note - enter your passcode.";
      }
      case "unlockNote": {
        return "To unlock note - enter your passcode.";
      }
      case "training": {
        return "This is training phase. You will need to enter your passcode several times.";
      }
      default: {
        break;
      }
    }
  };

  const getTitle = () => {
    switch (route.params.purpose) {
      case "creatingPin": {
        return "Create passcode";
      }
      case "unlockNote":
      case "seeNote": {
        return "Enter passcode";
      }
      case "training": {
        return "Enter created passcode";
      }
      default: {
        break;
      }
    }
  };

  const [inputData, setInputData] = useState(inputDataInit);

  const handlePressIn = (e: GestureResponderEvent, key: string) => {
    if (phase === "creatingPin") return;
    setInputData({
      ...inputData,
      input: inputData.input.concat(key),
      data: [...inputData.data, getPressData(e, key, "pressIn")],
    });
  };

  const handlePressOut = (e: GestureResponderEvent, key: string) => {
    if (phase === "creatingPin") return;
    setInputData({
      ...inputData,
      data: [...inputData.data, getPressData(e, key, "pressOut")],
    });
  };

  useEffect(() => {
    if (currentIndex === PIN_LENGTH) {
      if (phase === "training") {
        if (!validatePasscode(passcode.join(""))) {
          setError(true);
        } else {
          dispatch(
            addTrainingStepData({
              data: inputData,
            })
          );
          if (trainingStep === TRAINING_STEPS) {
            navigation.pop(2);
          }
          setTrainingStep(trainingStep + 1);
        }

        clearInput();
        return;
      } else if (phase === "seeNote" || phase === "unlockNote") {
        if (!validatePasscode(passcode.join(""))) {
          setError(true);
        } else {
          const isLegitimate = lockData.trainingData?.length
            ? authenticate1(lockData.trainingData, inputData, THRESHOLD)
            : false;

          if (isLegitimate) {
            if (phase === "unlockNote") {
              dispatch(editNote({ ...note, locked: false } as Note));
            }
            navigation.navigate("EditingNote", {
              newNote: false,
              note: note,
            });
          } else {
            Alert.alert("Authentication failed!");
          }
        }

        clearInput();
        return;
      }
    }
  }, [inputData, passcode]);

  const getPressData = (
    e: GestureResponderEvent,
    key: string,
    pressEventType: PressEventType
  ): KeyPressData => {
    return {
      id: inputData.data?.length || 0,
      key: key,
      pressEventType: pressEventType,
      timeStamp: e.timeStamp,
      pageX: e.nativeEvent.pageX,
      pageY: e.nativeEvent.pageY,
      pressure: e.nativeEvent.force || 0,
      locationX: e.nativeEvent.locationX,
      locationY: e.nativeEvent.locationY,
      gyroscode: { x: 0, y: 0, z: 0 },
    };
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>{getTitle()}</Text>
        <Text style={[styles.greyText, { marginHorizontal: "5%" }]}>
          {getDescription()}
        </Text>
        {phase === "training" && (
          <Text style={{ color: "#804409" }}>
            {TRAINING_STEPS - trainingStep + 1} inputs left
          </Text>
        )}

        {error && <Text style={styles.errorText}>Passcode incorrect</Text>}

        <View style={styles.space4} />
        <View style={styles.gridContainer}>
          {passcode.map((value, index) => (
            <PinCircle
              key={index}
              filled={value !== ""}
              style={{
                marginHorizontal:
                  pinCircleSize === "large"
                    ? 4
                    : pinCircleSize === "medium"
                    ? 2
                    : 1,
              }}
              size={pinCircleSize}
            />
          ))}
        </View>
        <View style={styles.space4} />

        <View style={styles.gridContainer}>
          {["1", "2", "3"].map((key) => (
            <TouchableOpacity
              key={key}
              style={styles.pinButton}
              onPress={enterSymbol(key)}
              onPressIn={(event: GestureResponderEvent) =>
                handlePressIn(event, key)
              }
              onPressOut={(event: GestureResponderEvent) =>
                handlePressOut(event, key)
              }
            >
              <Text style={styles.buttonText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.gridContainer}>
          {["4", "5", "6"].map((key) => (
            <TouchableOpacity
              key={key}
              style={styles.pinButton}
              onPress={enterSymbol(key)}
              onPressIn={(event: GestureResponderEvent) =>
                handlePressIn(event, key)
              }
              onPressOut={(event: GestureResponderEvent) =>
                handlePressOut(event, key)
              }
            >
              <Text style={styles.buttonText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.gridContainer}>
          {["7", "8", "9"].map((key) => (
            <TouchableOpacity
              key={key}
              style={styles.pinButton}
              onPress={enterSymbol(key)}
              onPressIn={(event: GestureResponderEvent) =>
                handlePressIn(event, key)
              }
              onPressOut={(event: GestureResponderEvent) =>
                handlePressOut(event, key)
              }
            >
              <Text style={styles.buttonText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={styles.pinButton}
            onPress={enterSymbol("0")}
            onPressIn={(event: GestureResponderEvent) =>
              handlePressIn(event, "0")
            }
            onPressOut={(event: GestureResponderEvent) =>
              handlePressOut(event, "0")
            }
          >
            <Text style={styles.buttonText}>0</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  pinButton: {
    backgroundColor: "#E0770F",
    width: "25%",
    aspectRatio: 1 / 1,
    borderRadius: 12,
    alignContent: "center",
    justifyContent: "center",
    margin: "2%",
  },
  buttonText: {
    fontSize: 24,
    alignSelf: "center",
  },
  text: {
    fontSize: 24,
    color: "#FFF8F0",
    fontWeight: "400",
    textAlign: "center",
  },
  greyText: {
    fontSize: 17,
    fontWeight: "400",
    textAlign: "center",
    color: "#FFF8F0",
    opacity: 0.65,
  },
  gridContainer: {
    flexDirection: "row",
  },
  errorText: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    color: "#fa7470",
    opacity: 0.65,
    marginVertical: 4,
  },

  space4: {
    height: "4%",
  },
});
