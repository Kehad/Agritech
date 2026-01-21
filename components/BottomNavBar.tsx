import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { COLORS } from "./utils";

interface BottomNavBarProps {
    onFabPress: () => void;
}

export const BottomNavBar = ({ onFabPress }: BottomNavBarProps) => {
    return (
        <>
            <TouchableOpacity
                style={styles.fab}
                onPress={onFabPress}
            >
                <MaterialIcons name="add" size={28} color="white" />
            </TouchableOpacity>

            <View style={styles.bottomBar}>
                <MaterialIcons name="dashboard" size={28} color={COLORS.primary} />
                <MaterialIcons name="analytics" size={28} color="#BDBDBD" />
                <View style={{ width: 40 }} />
                <MaterialIcons name="chat" size={28} color="#BDBDBD" />
                <MaterialIcons name="person" size={28} color="#BDBDBD" />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: COLORS.surface,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingBottom: 10,
    },
    fab: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        backgroundColor: COLORS.primary,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        zIndex: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});
