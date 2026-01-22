import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { ProfileStackParamList } from '../../navigation/ProfileNavigator';
import { COLORS, hp, wp } from 'components/utils';

type Props = StackScreenProps<ProfileStackParamList, 'About'>;

export default function AboutScreen({ navigation }: Props) {

    const LinkItem = ({ label, url }: { label: string, url: string }) => (
        <TouchableOpacity style={styles.linkItem} onPress={() => Linking.openURL(url)}>
            <Text style={styles.linkText}>{label}</Text>
            <MaterialIcons name="open-in-new" size={16} color={COLORS.primary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About FarmTech</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoPlaceholder}>
                        <MaterialIcons name="agriculture" size={60} color="#fff" />
                    </View>
                    <Text style={styles.appName}>FarmTech Osun</Text>
                    <Text style={styles.version}>Version 2.4.0 (Build 154)</Text>
                </View>

                <Text style={styles.description}>
                    FarmTech Osun is dedicated to empowering farmers with precision agriculture tools.
                    Monitor your crops, control irrigation, and get AI-driven insights to maximize your yield.
                </Text>

                <View style={styles.divider} />

                <Text style={styles.sectionHeader}>Legal</Text>
                <LinkItem label="Terms of Service" url="https://farmtech.osun/terms" />
                <LinkItem label="Privacy Policy" url="https://farmtech.osun/privacy" />
                <LinkItem label="Open Source Licenses" url="https://farmtech.osun/licenses" />

                <View style={styles.divider} />

                <Text style={styles.sectionHeader}>Connect with Us</Text>
                <View style={styles.socialRow}>
                    {['twitter', 'facebook', 'instagram', 'linkedin'].map((icon) => (
                        <TouchableOpacity key={icon} style={styles.socialBtn}>
                            <FontAwesome5 name={icon} size={20} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.copyright}>© 2026 FarmTech Osun. All rights reserved.</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: wp(4), paddingVertical: hp(2), backgroundColor: COLORS.surface,
        borderBottomWidth: 1, borderBottomColor: COLORS.border,
    },
    backButton: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: '600', color: COLORS.textPrimary },
    content: { padding: wp(4), alignItems: 'center' },
    logoContainer: { alignItems: 'center', marginBottom: hp(3), marginTop: hp(2) },
    logoPlaceholder: {
        width: 100, height: 100, backgroundColor: COLORS.primary, borderRadius: 20,
        justifyContent: 'center', alignItems: 'center', marginBottom: hp(2),
        shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8
    },
    appName: { fontSize: 24, fontWeight: 'bold', color: COLORS.textPrimary },
    version: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
    description: { textAlign: 'center', color: COLORS.textSecondary, lineHeight: 22, fontSize: 14, marginBottom: hp(2) },
    divider: { width: '100%', height: 1, backgroundColor: COLORS.border, marginVertical: hp(2) },
    sectionHeader: { alignSelf: 'flex-start', fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: hp(2) },
    linkItem: {
        width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: hp(1.5), borderBottomWidth: 1, borderBottomColor: COLORS.background
    },
    linkText: { fontSize: 16, color: COLORS.primary },
    socialRow: { flexDirection: 'row', justifyContent: 'center', width: '100%', marginBottom: hp(4) },
    socialBtn: {
        width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.surface,
        justifyContent: 'center', alignItems: 'center', marginHorizontal: 8,
        borderWidth: 1, borderColor: COLORS.border
    },
    copyright: { fontSize: 12, color: COLORS.textSecondary, marginBottom: hp(2) }
});