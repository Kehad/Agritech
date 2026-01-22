import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, hp } from "components/utils";
import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

interface ProfileHeaderProps {
    name: string;
    role: string;
    imageUri: string;
}

export const ProfileHeader = ({ name, role, imageUri }: ProfileHeaderProps) => {
    return (
        <View style={styles.header}>
            <View style={styles.avatarContainer}>
                <Image
                    source={{ uri: imageUri }}
                    style={styles.avatar}
                />
                <View style={styles.editBadge}>
                    <MaterialIcons name="edit" size={14} color="white" />
                </View>
            </View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.role}>{role}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginBottom: hp(3),
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: hp(1.5),
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: COLORS.surface,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.primary,
        padding: 6,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.surface,
    },
    name: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    role: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
});
