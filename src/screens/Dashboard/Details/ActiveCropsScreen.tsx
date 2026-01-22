import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, TextInput, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, hp, wp } from 'components/utils';
import { useNavigation } from '@react-navigation/native';

const ActiveCropsScreen = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);

    // Initial Data
    const [crops, setCrops] = useState([
        { id: 1, name: 'Maize', variety: 'Hybrid-9', stage: 'Flowering', progress: 0.65, planted: '12 Oct 2025', harvest: '15 Jan 2026', image: 'https://cdn.pixabay.com/photo/2014/04/05/11/39/corn-316526_1280.jpg' },
        { id: 2, name: 'Cassava', variety: 'TME 419', stage: 'Vegetative', progress: 0.30, planted: '20 Nov 2025', harvest: '20 Aug 2026', image: 'https://cdn.pixabay.com/photo/2017/07/31/16/09/cassava-2559385_1280.jpg' },
        { id: 3, name: 'Tomatoes', variety: 'Roma', stage: 'Fruiting', progress: 0.80, planted: '01 Dec 2025', harvest: '20 Feb 2026', image: 'https://cdn.pixabay.com/photo/2011/03/16/16/01/tomatoes-5356_1280.jpg' },
    ]);

    // New Crop State
    const [newCrop, setNewCrop] = useState({ name: '', variety: '', stage: '' });

    const handleAddCrop = () => {
        if (!newCrop.name || !newCrop.variety || !newCrop.stage) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        const newId = crops.length > 0 ? Math.max(...crops.map(c => c.id)) + 1 : 1;
        const today = new Date();
        const plantedDate = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

        // Mock harvest date (3 months from now)
        const harvestDateObj = new Date();
        harvestDateObj.setMonth(harvestDateObj.getMonth() + 3);
        const harvestDate = harvestDateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

        const newItem = {
            id: newId,
            name: newCrop.name,
            variety: newCrop.variety,
            stage: newCrop.stage,
            progress: 0.05, // Start with 5%
            planted: plantedDate,
            harvest: harvestDate,
            image: 'https://cdn.pixabay.com/photo/2016/10/22/20/34/wines-1761613_1280.jpg' // Generic placeholders could be randomized
        };

        setCrops([newItem, ...crops]);
        setNewCrop({ name: '', variety: '', stage: '' });
        setModalVisible(false);
    };

    const handleDeleteCrop = (id: number) => {
        Alert.alert(
            "Remove Crop",
            "Are you sure you want to remove this crop from your active list?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: () => setCrops(crops.filter(c => c.id !== id))
                }
            ]
        );
    };

    const ProgressBar = ({ progress }: { progress: number }) => (
        <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Active Crops</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                    <MaterialIcons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {crops.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="eco" size={64} color={COLORS.border} />
                        <Text style={styles.emptyText}>No active crops. Add one!</Text>
                    </View>
                ) : (
                    crops.map((crop) => (
                        <TouchableOpacity
                            key={crop.id}
                            style={styles.cropCard}
                            onLongPress={() => handleDeleteCrop(crop.id)}
                            activeOpacity={0.9}
                        >
                            <Image source={{ uri: crop.image }} style={styles.cropImage} />
                            <View style={styles.cropDetails}>
                                <View style={styles.cropHeader}>
                                    <Text style={styles.cropName}>{crop.name}</Text>
                                    <View style={styles.stageBadge}>
                                        <Text style={styles.stageText}>{crop.stage}</Text>
                                    </View>
                                </View>
                                <Text style={styles.cropVariety}>{crop.variety}</Text>

                                <View style={styles.progressSection}>
                                    <Text style={styles.progressLabel}>Growth: {Math.round(crop.progress * 100)}%</Text>
                                    <ProgressBar progress={crop.progress} />
                                </View>

                                <View style={styles.dateRow}>
                                    <View style={styles.dateItem}>
                                        <MaterialIcons name="event" size={14} color={COLORS.textSecondary} />
                                        <Text style={styles.dateText}>Planted: {crop.planted}</Text>
                                    </View>
                                    <View style={styles.dateItem}>
                                        <MaterialIcons name="event-available" size={14} color={COLORS.success} />
                                        <Text style={[styles.dateText, { color: COLORS.success }]}>Est. Harvest: {crop.harvest}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            {/* Add Crop Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Add New Crop</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <MaterialIcons name="close" size={24} color={COLORS.textSecondary} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Crop Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. Maize"
                                    value={newCrop.name}
                                    onChangeText={t => setNewCrop({ ...newCrop, name: t })}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Variety</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. Hybrid-9"
                                    value={newCrop.variety}
                                    onChangeText={t => setNewCrop({ ...newCrop, variety: t })}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Current Stage</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. Germination"
                                    value={newCrop.stage}
                                    onChangeText={t => setNewCrop({ ...newCrop, stage: t })}
                                />
                            </View>

                            <TouchableOpacity style={styles.submitButton} onPress={handleAddCrop}>
                                <Text style={styles.submitButtonText}>Add Crop</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
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
    addButton: {
        backgroundColor: COLORS.primary,
        width: 36, height: 36, borderRadius: 18,
        justifyContent: 'center', alignItems: 'center',
    },
    content: { padding: wp(4) },
    emptyContainer: { alignItems: 'center', marginTop: hp(10) },
    emptyText: { marginTop: 10, fontSize: 16, color: COLORS.textSecondary },
    cropCard: {
        backgroundColor: COLORS.surface, borderRadius: wp(3), marginBottom: hp(2),
        overflow: 'hidden', elevation: 2, shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
    },
    cropImage: { width: '100%', height: hp(18) },
    cropDetails: { padding: wp(4) },
    cropHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    cropName: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
    stageBadge: {
        backgroundColor: COLORS.primary + '20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
    },
    stageText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
    cropVariety: { fontSize: 14, color: COLORS.textSecondary, marginBottom: hp(2) },
    progressSection: { marginBottom: hp(2) },
    progressBarContainer: {
        height: 8, backgroundColor: COLORS.border, borderRadius: 4, marginTop: 6, overflow: 'hidden',
    },
    progressBarFill: { height: '100%', backgroundColor: COLORS.success },
    progressLabel: { fontSize: 12, color: COLORS.textSecondary },
    dateRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: hp(1.5) },
    dateItem: { flexDirection: 'row', alignItems: 'center' },
    dateText: { fontSize: 12, color: COLORS.textSecondary, marginLeft: 4 },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: wp(5),
    },
    modalContainer: {
        backgroundColor: COLORS.surface,
        borderRadius: wp(4),
        padding: wp(5),
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(3),
    },
    modalTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
    inputGroup: { marginBottom: hp(2) },
    inputLabel: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 8 },
    input: {
        borderWidth: 1, borderColor: COLORS.border, borderRadius: 8,
        paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: COLORS.textPrimary
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: hp(2),
    },
    submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default ActiveCropsScreen;
