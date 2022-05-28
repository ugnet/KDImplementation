// Statistical classifier from:
// Cheng-Jung Tasia, Ting-Yi Chang, Pei-Cheng Cheng and Jyun-Hao Lin
// "Two novel biometric features in keystroke dynamics authentication systems for touch screen devices"

import { InputData } from "../state/lock_slice";
import { extractFeatures, extractFeaturesTesting } from "./featureExtractors";

const getMeans = (extractedFeatures: Array<Array<number>>) => {
  const meansArray: Array<number> = [];

  for (let i = 0; i < extractedFeatures[0].length; i++) {
    let sameFeatureDiferentSteps = [];
    for (let j = 0; j < extractedFeatures.length; j++) {
      sameFeatureDiferentSteps.push(extractedFeatures[j][i]);
    }
    const sum = sameFeatureDiferentSteps.reduce((a, b) => a + b, 0);
    const mean = sum / extractedFeatures.length;
    meansArray.push(mean);
  }
  return meansArray;
};

const getMeanAbsoluteDeviations = (
  means: Array<number>,
  extractedFeatures: Array<Array<number>>
) => {
  const deviationsArray: Array<number> = [];

  for (let i = 0; i < extractedFeatures[0].length; i++) {
    let sameFeatureDiferentSteps = [];
    for (let j = 0; j < extractedFeatures.length; j++) {
      sameFeatureDiferentSteps.push(extractedFeatures[j][i]);
    }
    const sum = sameFeatureDiferentSteps.reduce(
      (a, b) => a + Math.abs(b - means[i]),
      0
    );
    const meanAbsoluteDeviation = sum / extractedFeatures.length;
    deviationsArray.push(meanAbsoluteDeviation);
  }

  return deviationsArray;
};

const getAverageDistance = (
  means: Array<number>,
  absoluteDeviations: Array<number>,
  valuesToAuthenticate: Array<number>
) => {
  const sum = valuesToAuthenticate.reduce(
    (a, b, currentIndex) =>
      a + Math.abs(b - means[currentIndex]) / absoluteDeviations[currentIndex],
    0
  );

  const averageDistance = sum / valuesToAuthenticate.length;
  return averageDistance;
};

// AUTHENTICATE: true = legitimate, false=impostor
export const authenticate1 = (
  trainingData: Array<InputData>,
  inputData: InputData,
  threshold: number
) => {
  const features = extractFeatures(trainingData);
  const means = getMeans(features);
  const meanAbsoluteDeviations = getMeanAbsoluteDeviations(means, features);

  const averageDistance = getAverageDistance(
    means,
    meanAbsoluteDeviations,
    extractFeaturesTesting(inputData)
  );

  return averageDistance <= threshold;
};
