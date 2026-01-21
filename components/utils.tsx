import { Dimensions } from "react-native";

// --- UTILS (Mimicking Sizer) ---
const { width, height } = Dimensions.get('window');
export const wp = (percentage: number) => (width * percentage) / 100;
export const hp = (percentage: number) => (height * percentage) / 100;

// --- THEME CONSTANTS ---
export const COLORS = {
  primary: '#4CAF50', // Green
  onPrimary: '#FFFFFF',
  secondary: '#2196F3', // Blue
  tertiary: '#FFC107', // Amber
  surface: '#FFFFFF',
  background: '#F5F5F5',
  textPrimary: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  error: '#B00020',
};