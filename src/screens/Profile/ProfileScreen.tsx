
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, hp, wp } from "components/utils";
import React, { JSX } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileHeader } from "components/Profile/ProfileHeader";
import { ProfileStats } from "components/Profile/ProfileStats";
import { MenuItem } from "components/Profile/MenuItem";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ProfileStackParamList } from "../../navigation/ProfileNavigator";

export default function ProfileScreen(): JSX.Element {
    const navigation = useNavigation<StackNavigationProp<ProfileStackParamList>>();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Profile Header */}
                <ProfileHeader
                    name="John Doe"
                    role="Senior Farmer • Osun State"
                    imageUri="https://i.pravatar.cc/300"
                />

                {/* Stats Row */}
                <ProfileStats />

                {/* Menu Sections */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>
                    <MenuItem
                        icon="person-outline"
                        label="Personal Information"
                        onPress={() => navigation.navigate('PersonalInfo')}
                    />
                    <MenuItem
                        icon="notifications-none"
                        label="Notifications"
                        badge="2"
                        onPress={() => navigation.navigate('Notifications')}
                    />
                    <MenuItem
                        icon="lock-outline"
                        label="Security & Privacy"
                        onPress={() => navigation.navigate('SecurityPrivacy')}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>App Settings</Text>
                    <MenuItem icon="language" label="Language" value="English" />
                    <MenuItem icon="dark-mode" label="Dark Mode" isSwitch />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <MenuItem
                        icon="help-outline"
                        label="Help Center"
                        onPress={() => navigation.navigate('HelpCenter')}
                    />
                    <MenuItem
                        icon="info-outline"
                        label="About FarmTech"
                        onPress={() => navigation.navigate('About')}
                    />
                </View>

                <TouchableOpacity style={styles.logoutButton}>
                    <MaterialIcons name="logout" size={20} color={COLORS.error} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <View style={{ height: hp(10) }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
    },
    section: {
        marginBottom: hp(3),
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: hp(1.5),
        marginLeft: wp(2),
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFEBEE', // Light Red
        padding: hp(2),
        borderRadius: wp(3),
        marginTop: hp(1),
    },
    logoutText: {
        color: COLORS.error,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    }
});
