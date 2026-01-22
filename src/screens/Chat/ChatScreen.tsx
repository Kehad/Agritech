import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, hp, wp } from 'components/utils';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChatStackParamList } from '../../navigation/ChatNavigator';

const ChatScreen = () => {
    const navigation = useNavigation<StackNavigationProp<ChatStackParamList>>();

    const users = [
        { id: '1', name: 'Dr. Akeem', role: 'Ext. Officer', image: 'https://i.pravatar.cc/100?img=11', active: true },
        { id: '2', name: 'Mama Nkechi', role: 'Supplier', image: 'https://i.pravatar.cc/100?img=5', active: true },
        { id: '3', name: 'Oluwaseun', role: 'Vet', image: 'https://i.pravatar.cc/100?img=3', active: false },
        { id: '4', name: 'Co-op Group', role: 'Community', image: 'https://i.pravatar.cc/100?img=8', active: false },
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
        navigation.navigate('ChatDetail', {
            id: item.id,
            name: item.name,
            image: item.image,
            active: true // Or derive from users list if possible
        });
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Community</Text>
            <TouchableOpacity style={styles.iconBtn}>
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

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {renderHeader()}

            <View style={{ flex: 1 }}>
                <FlatList
                    data={messages}
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
});

export default ChatScreen;
