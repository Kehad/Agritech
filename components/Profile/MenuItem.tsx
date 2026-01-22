import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, wp } from "components/utils";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { hp } from "components/utils"; // Importing hp separately if needed or existing utils covers it

interface MenuItemProps {
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string;
    value?: string;
    badge?: string;
    isSwitch?: boolean;
    onPress?: () => void;
}

export const MenuItem = ({ icon, label, value, badge, isSwitch, onPress }: MenuItemProps) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuIconContainer}>
            <MaterialIcons name={icon} size={22} color={COLORS.primary} />
        </View>
        <View style={styles.menuContent}>
            <Text style={styles.menuLabel}>{label}</Text>
        </View>
        <View style={styles.menuRight}>
            {value && <Text style={styles.menuValue}>{value}</Text>}
            {badge && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badge}</Text>
                </View>
            )}
            {isSwitch && (
                <View style={[styles.toggleSwitch, { backgroundColor: '#E0E0E0' }]}>
                    <View style={styles.toggleKnob} />
                </View>
            )}
            {!isSwitch && !value && !badge && (
                <MaterialIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
            )}
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: wp(4),
        marginBottom: hp(1),
        borderRadius: wp(3),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
        elevation: 1,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(76, 175, 80, 0.1)', // Primary opacity
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp(3),
    },
    menuContent: {
        flex: 1,
    },
    menuLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: COLORS.textPrimary,
    },
    menuRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuValue: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginRight: 8,
    },
    badge: {
        backgroundColor: COLORS.error,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginRight: 8,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    toggleSwitch: {
        width: 40,
        height: 22,
        borderRadius: 11,
        padding: 2,
    },
    toggleKnob: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
});
