export interface PromptFormState {
  sceneTitle: string;
  characterCoreDescription: string;
  characterVoiceDetails: string;
  characterAction: string;
  characterExpression: string;
  sceneLocationTime: string;
  additionalVisualDetails: string; // For free text visual details
  cameraMovement: string; // Stores the value of the selected camera movement
  overallAtmosphere: string;
  environmentalSounds: string;
  characterDialog: string;
  aspectRatio: string;
  negativePrompt: string;
}

export interface AspectRatioOption {
  value: string;
  label: string;
}

export interface CameraMovementOption {
  value: string;
  label_id: string; // Indonesian label
  label_en: string; // English label
}
