import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, FlatList, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { COLORS, hp, wp } from 'components/utils';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChatStackParamList } from '../../navigation/ChatNavigator';

const ChatScreen = () => {
    const navigation = useNavigation<StackNavigationProp<ChatStackParamList>>();

    // States for New Chat
    const [isNewChatVisible, setIsNewChatVisible] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

    // States for Main List Search
    const [mainSearch, setMainSearch] = useState('');

    const users = [
        { id: '1', name: 'Dr. Akeem', role: 'Ext. Officer', image: 'https://i.pravatar.cc/100?img=11', active: true },
        { id: '2', name: 'Mama Nkechi', role: 'Supplier', image: 'https://i.pravatar.cc/100?img=5', active: true },
        { id: '3', name: 'Oluwaseun', role: 'Vet', image: 'https://i.pravatar.cc/100?img=3', active: false },
        { id: '4', name: 'Co-op Group', role: 'Community', image: 'https://i.pravatar.cc/100?img=8', active: false },
    ];

    const availableContacts = [
        ...users,
        { id: '5', name: 'John Doe', role: 'Farmer', image: 'https://i.pravatar.cc/100?img=13', active: true },
        { id: '6', name: 'Sarah Smith', role: 'Buyer', image: 'https://i.pravatar.cc/100?img=9', active: false },
        { id: '7', name: 'AgroSupport', role: 'Support', image: 'https://ui-avatars.com/api/?name=Agro+Support&background=0D8ABC&color=fff', active: true }
    ];

    const messages = [
        {
            id: '1',
            name: 'Dr. Akeem',
            message: 'Remember to check the pH levels before applying fertilizer.',
            time: '10:30 AM',
            count: 2,
            image: 'https://i.pravatar.cc/100?img=11'
        },
        {
            id: '2',
            name: 'Maize Farmers Co-op',
            message: 'Meeting scheduled for Friday at the town hall.',
            time: 'Yesterday',
            count: 0,
            image: 'https://i.pravatar.cc/100?img=8'
        },
        {
            id: '3',
            name: 'Mama Nkechi (Seeds)',
            message: 'Your order has been dispatched. Expect delivery tomorrow.',
            time: 'Yesterday',
            count: 0,
            image: 'https://i.pravatar.cc/100?img=5'
        },
        {
            id: '4',
            name: 'AgroSupport',
            message: 'Ticket #4029 resolved. Check your email for details.',
            time: 'Mon',
            count: 0,
            image: 'https://ui-avatars.com/api/?name=Agro+Support&background=0D8ABC&color=fff'
        },
        {
            id: '5',
            name: 'John (Labor)',
            message: 'Boss, we are done with the weeding.',
            time: 'Mon',
            count: 1,
            image: 'https://i.pravatar.cc/100?img=13'
        }
    ];

    const handleChatPress = (item: any) => {
        setIsNewChatVisible(false); // Close modal if open
        navigation.navigate('ChatDetail', {
            id: item.id,
            name: item.name,
            image: item.image,
            active: item.active || true
        });
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Community</Text>
            <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => setIsNewChatVisible(true)}
            >
                <MaterialIcons name="edit" size={24} color={COLORS.primary} />
            </TouchableOpacity>
        </View>
    );

    const renderSearchBar = () => (
        <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={24} color={COLORS.textSecondary} />
            <TextInput
                style={styles.searchInput}
                placeholder="Search messages..."
                placeholderTextColor={COLORS.textSecondary}
                value={mainSearch}
                onChangeText={setMainSearch}
            />
        </View>
    );

    const renderActiveUsers = () => (
        <View style={styles.activeUserSection}>
            <Text style={styles.sectionTitle}>Active Experts</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: wp(4) }}>
                {users.map(user => (
                    <TouchableOpacity
                        key={user.id}
                        style={styles.userItem}
                        onPress={() => navigation.navigate('ChatDetail', {
                            id: user.id,
                            name: user.name,
                            image: user.image,
                            active: user.active
                        })}
                    >
                        <View>
                            <Image source={{ uri: user.image }} style={styles.avatarLarge} />
                            {user.active && <View style={styles.activeBadge} />}
                        </View>
                        <Text style={styles.userName} numberOfLines={1}>{user.name.split(' ')[0]}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const renderMessageItem = ({ item }: any) => (
        <TouchableOpacity style={styles.messageItem} onPress={() => handleChatPress(item)}>
            <Image source={{ uri: item.image }} style={styles.avatar} />
            <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                    <Text style={styles.senderName}>{item.name}</Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <View style={styles.messageFooter}>
                    <Text style={styles.messageText} numberOfLines={1}>{item.message}</Text>
                    {item.count > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{item.count}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    // New Chat Modal Content
    const filteredContacts = availableContacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Main List Filtered Messages
    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(mainSearch.toLowerCase()) ||
        msg.message.toLowerCase().includes(mainSearch.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {renderHeader()}

            <View style={{ flex: 1 }}>
                <FlatList
                    data={filteredMessages}
                    keyExtractor={item => item.id}
                    renderItem={renderMessageItem}

                    ListHeaderComponent={
                        <>
                            {renderSearchBar()}
                            {renderActiveUsers()}
                            <View style={styles.listDivider} />
                            <Text style={[styles.sectionTitle, { marginLeft: wp(4), marginBottom: hp(1) }]}>Recent Chats</Text>
                        </>
                    }
                    contentContainerStyle={{ paddingBottom: hp(10) }}
                />
            </View>

            {/* New Chat Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isNewChatVisible}
                onRequestClose={() => setIsNewChatVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setIsNewChatVisible(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>New Message</Text>
                            <View style={{ width: 50 }} />
                        </View>

                        <View style={styles.modalSearch}>
                            <Text style={styles.toLabel}>To:</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Search Name or Number"
                                value={searchTerm}
                                onChangeText={setSearchTerm}
                                autoFocus
                            />
                        </View>

                        <Text style={styles.modalSectionTitle}>Suggested</Text>
                        <FlatList
                            data={filteredContacts}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.contactItem}
                                    onPress={() => handleChatPress(item)}
                                >
                                    <Image source={{ uri: item.image }} style={styles.avatar} />
                                    <View style={styles.contactInfo}>
                                        <Text style={styles.contactName}>{item.name}</Text>
                                        <Text style={styles.contactRole}>{item.role}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
        backgroundColor: COLORS.surface,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary + '10',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        marginHorizontal: wp(4),
        marginVertical: hp(2),
        paddingHorizontal: wp(4),
        height: 48,
        borderRadius: wp(3),
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: COLORS.textPrimary,
    },
    activeUserSection: {
        marginBottom: hp(3),
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginLeft: wp(4),
        marginBottom: hp(1.5),
    },
    userItem: {
        alignItems: 'center',
        marginRight: wp(5),
        width: 60,
    },
    avatarLarge: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    activeBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: COLORS.success,
        borderWidth: 2,
        borderColor: COLORS.surface,
    },
    userName: {
        fontSize: 12,
        color: COLORS.textPrimary,
        marginTop: 6,
        textAlign: 'center',
    },
    listDivider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginBottom: hp(2),
    },
    messageItem: {
        flexDirection: 'row',
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.5),
        backgroundColor: COLORS.background,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#eee',
    },
    messageContent: {
        flex: 1,
        marginLeft: wp(3),
        justifyContent: 'center',
    },
    messageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    senderName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    timeText: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    messageFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    messageText: {
        flex: 1,
        fontSize: 14,
        color: COLORS.textSecondary,
        marginRight: 8,
    },
    badge: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '90%',
        paddingTop: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    cancelText: {
        fontSize: 16,
        color: COLORS.primary,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalSearch: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 15,
        marginBottom: 15,
    },
    toLabel: {
        fontSize: 16,
        color: '#999',
        marginRight: 10,
    },
    modalInput: {
        flex: 1,
        fontSize: 16,
    },
    modalSectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginLeft: 20,
        marginBottom: 10,
    },
    contactItem: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 12,
        alignItems: 'center',
    },
    contactInfo: {
        marginLeft: 15,
        justifyContent: 'center',
    },
    contactName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    contactRole: {
        fontSize: 14,
        color: '#666',
    },
});

export default ChatScreen;
