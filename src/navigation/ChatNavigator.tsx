import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from '../screens/Chat/ChatScreen';
import ChatDetailScreen from '../screens/Chat/ChatDetailScreen';

export type ChatStackParamList = {
    ChatList: undefined;
    ChatDetail: {
        id: string;
        name: string;
        image: string;
        active?: boolean;
    };
};

const Stack = createStackNavigator<ChatStackParamList>();

export default function ChatNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="ChatList"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="ChatList" component={ChatScreen} />
            <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
        </Stack.Navigator>
    );
}
