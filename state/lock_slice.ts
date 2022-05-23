import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type InputPurpose =
  | "training"
  | "seeNote"
  | "creatingPin"
  | "unlockNote";

export type PressEventType = "pressIn" | "pressOut" | "press";

export interface LockData {
  classificator?: number;
  features?: number[];
  pinLength?: number;
  pinCode?: string;
  numberOfTrainingSteps?: number;
  trainingData?: Array<InputData>;
}

export interface InputData {
  input: string;
  purpose: InputPurpose;
  data: Array<KeyPressData>;
}

export interface KeyPressData {
  id: number;
  key: string;
  pressEventType: PressEventType;
  timeStamp: number;
  pressure: number;
  pageX: number;
  pageY: number;
  locationX: number;
  locationY: number;
  gyroscode: { x: number; y: number; z: number };
}

const initialState: LockData = {};

const lockSlice = createSlice({
  name: "lockSlice",
  initialState,
  reducers: {
    addPin(state: LockData, action: PayloadAction<string>) {
      state.pinCode = action.payload;
    },
    addTrainingStepData(
      state: LockData,
      action: PayloadAction<{
        data: InputData;
      }>
    ) {
      if (state.trainingData?.length) {
        state.trainingData = [...state.trainingData, action.payload.data];
      } else {
        state.trainingData = [action.payload.data];
      }
    },
  },
});

export const { addPin, addTrainingStepData } = lockSlice.actions;
export default lockSlice.reducer;
