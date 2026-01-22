import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import EditProfile from '../screens/Profile/EditProfile';
import AboutScreen from '../screens/Profile/AboutPage';
import SecurityPrivacyScreen from '../screens/Profile/SettingsScreen';
import NotificationsScreen from '../screens/Profile/NotificationScreen';
import HelpCenterScreen from '../screens/Profile/HelpCenter';

export type ProfileStackParamList = {
    ProfileMain: undefined;
    PersonalInfo: undefined;
    Notifications: undefined;
    SecurityPrivacy: undefined;
    HelpCenter: undefined;
    About: undefined;
};

const Stack = createStackNavigator<ProfileStackParamList>();

export default function ProfileNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="ProfileMain"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="ProfileMain" component={ProfileScreen} />
            <Stack.Screen name="PersonalInfo" component={EditProfile} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="SecurityPrivacy" component={SecurityPrivacyScreen} />
            <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
        </Stack.Navigator>
    );
}
