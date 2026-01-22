import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, hp, wp } from 'components/utils';
import { useNavigation } from '@react-navigation/native';

const IrrigationScreen = () => {
    const navigation = useNavigation();

    const [zones, setZones] = useState([
        { id: 1, name: 'Zone A (Maize)', active: true, moisture: 45, nextSchedule: '06:00 AM' },
        { id: 2, name: 'Zone B (Cassava)', active: false, moisture: 60, nextSchedule: '06:00 AM' },
        { id: 3, name: 'Zone C (Nursery)', active: true, moisture: 55, nextSchedule: '08:00 AM' },
    ]);

    const toggleZone = (id: number) => {
        setZones(zones.map(z => z.id === id ? { ...z, active: !z.active } : z));
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Irrigation Control</Text>
                <TouchableOpacity style={styles.settingsButton}>
                    <MaterialIcons name="settings" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* System Status */}
                <View style={styles.mainStatusCard}>
                    <View style={styles.statusHeader}>
                        <MaterialIcons name="water-drop" size={32} color="#fff" />
                        <Text style={styles.mainStatusTitle}>System Status</Text>
                    </View>
                    <Text style={styles.mainStatusText}>2 of 3 Zones Active</Text>
                    <Text style={styles.waterUsageText}>Daily usage: 1,250 Liters</Text>
                </View>

                <Text style={styles.sectionTitle}>Zone Control</Text>

                {zones.map((zone) => (
                    <View key={zone.id} style={styles.zoneCard}>
                        <View style={styles.zoneHeader}>
                            <View style={styles.zoneInfo}>
                                <Text style={styles.zoneName}>{zone.name}</Text>
                                <View style={styles.moistureRow}>
                                    <MaterialIcons name="opacity" size={16} color={COLORS.secondary} />
                                    <Text style={styles.moistureText}>Moisture: {zone.moisture}%</Text>
                                </View>
                            </View>
                            <Switch
                                trackColor={{ false: "#767577", true: COLORS.primary }}
                                thumbColor={zone.active ? "#fff" : "#f4f3f4"}
                                onValueChange={() => toggleZone(zone.id)}
                                value={zone.active}
                            />
                        </View>
                        <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: hp(1.5) }} />
                        <View style={styles.zoneFooter}>
                            <Text style={styles.scheduleText}>Next: {zone.nextSchedule}</Text>
                            <Text style={[styles.statusText, { color: zone.active ? COLORS.success : COLORS.textSecondary }]}>
                                {zone.active ? 'Running' : 'Idle'}
                            </Text>
                        </View>
                    </View>
                ))}
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
    settingsButton: { padding: 4 },
    content: { padding: wp(4) },
    mainStatusCard: {
        backgroundColor: COLORS.secondary, borderRadius: wp(4), padding: wp(5), marginBottom: hp(3),
        shadowColor: COLORS.secondary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5
    },
    statusHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: hp(1) },
    mainStatusTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginLeft: wp(3) },
    mainStatusText: { fontSize: 16, color: 'rgba(255,255,255,0.9)', marginBottom: 4 },
    waterUsageText: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginBottom: hp(2) },
    zoneCard: {
        backgroundColor: COLORS.surface, borderRadius: wp(3), padding: wp(4), marginBottom: hp(2),
        elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
    },
    zoneHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    zoneInfo: { flex: 1 },
    zoneName: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 4 },
    moistureRow: { flexDirection: 'row', alignItems: 'center' },
    moistureText: { fontSize: 13, color: COLORS.textSecondary, marginLeft: 4 },
    zoneFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    scheduleText: { fontSize: 13, color: COLORS.textSecondary },
    statusText: { fontSize: 13, fontWeight: '600' },
});

export default IrrigationScreen;
