import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import ActiveCropsScreen from '../screens/Dashboard/Details/ActiveCropsScreen';
import IrrigationScreen from '../screens/Dashboard/Details/IrrigationScreen';
import AIRecommendationsScreen from '../screens/Dashboard/Details/AIRecommendationsScreen';
import TasksScreen from '../screens/Dashboard/Details/TasksScreen';
import InsightDetailScreen from '../screens/Analytics/InsightDetailScreen';

export type DashboardStackParamList = {
    DashboardMain: undefined;
    ActiveCrops: undefined;
    Irrigation: undefined;
    AIRecommendations: undefined;
    Tasks: undefined;
    InsightDetail: undefined;
};

const Stack = createStackNavigator<DashboardStackParamList>();

export default function DashboardNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="DashboardMain"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="DashboardMain" component={DashboardScreen} />
            <Stack.Screen name="ActiveCrops" component={ActiveCropsScreen} />
            <Stack.Screen name="Irrigation" component={IrrigationScreen} />
            <Stack.Screen name="AIRecommendations" component={AIRecommendationsScreen} />
            <Stack.Screen name="Tasks" component={TasksScreen} />
            <Stack.Screen name="InsightDetail" component={InsightDetailScreen} />
        </Stack.Navigator>
    );
}
