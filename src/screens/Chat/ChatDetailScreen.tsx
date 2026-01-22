import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    FlatList, KeyboardAvoidingView, Platform, Image, LayoutAnimation, UIManager, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, hp, wp } from 'components/utils';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { ChatStackParamList } from '../../navigation/ChatNavigator';
import * as ImagePicker from 'expo-image-picker';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

type ChatDetailRouteProp = RouteProp<ChatStackParamList, 'ChatDetail'>;

interface Message {
    id: string;
    text: string;
    sender: 'me' | 'other';
    time: string;
    type: 'text' | 'image' | 'voice';
    attachmentUrl?: string;
    status: 'sent' | 'delivered' | 'read';
}

export default function ChatDetailScreen() {
    const route = useRoute<ChatDetailRouteProp>();
    const navigation = useNavigation();
    const { id, name, image, active } = route.params || { id: '0', name: 'Unknown', image: 'https://i.pravatar.cc/100', active: false };

    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Hello! How is the maize harvest coming along?', sender: 'other', time: '09:00 AM', type: 'text', status: 'read' },
        { id: '2', text: 'It is going well, thank you. We are expecting a bumper harvest this season.', sender: 'me', time: '09:05 AM', type: 'text', status: 'read' },
        { id: '3', text: 'That is great news! improved seeds really made a difference.', sender: 'other', time: '09:07 AM', type: 'text', status: 'read' },
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    // Auto-scroll on new message
    useEffect(() => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages]);

    const sendMessage = () => {
        if (inputText.trim().length === 0) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'text',
            status: 'sent'
        };

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setMessages(prev => [...prev, newMessage]);
        setInputText('');

        // Simulate reply
        setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
                const reply: Message = {
                    id: (Date.now() + 1).toString(),
                    text: 'That sounds excellent! Let me know if you need any logistics support.',
                    sender: 'other',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type: 'text',
                    status: 'read'
                };
                setIsTyping(false);
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setMessages(prev => [...prev, reply]);
            }, 2000);
        }, 1000);
    };

    const handlePickImage = async () => {
        // Request permissions
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permission Required", "You need to allow access to your photos to send images.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: 'Image sent',
                sender: 'me',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'image',
                attachmentUrl: result.assets[0].uri,
                status: 'sent'
            };
            setMessages(prev => [...prev, newMessage]);
        }
    };

    const renderMessageBubble = ({ item }: { item: Message }) => {
        const isMe = item.sender === 'me';
        return (
            <View style={[
                styles.messageBubbleContainer,
                isMe ? styles.myMessageContainer : styles.otherMessageContainer
            ]}>
                {!isMe && (
                    <Image source={{ uri: image }} style={styles.senderAvatarSmall} />
                )}
                <View style={[
                    styles.messageBubble,
                    isMe ? styles.myMessage : styles.otherMessage,
                    item.type === 'image' && styles.imageBubble
                ]}>
                    {item.type === 'image' ? (
                        <Image source={{ uri: item.attachmentUrl }} style={styles.messageImage} />
                    ) : (
                        <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>
                            {item.text}
                        </Text>
                    )}

                    <View style={styles.metaContainer}>
                        <Text style={[styles.timeText, isMe ? styles.myTimeText : styles.otherTimeText]}>
                            {item.time}
                        </Text>
                        {isMe && (
                            <Ionicons
                                name={item.status === 'read' ? "checkmark-done" : "checkmark"}
                                size={14}
                                color="rgba(255,255,255,0.7)"
                                style={{ marginLeft: 4 }}
                            />
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>

                <View style={styles.headerInfo}>
                    <View>
                        <Image source={{ uri: image }} style={styles.avatar} />
                        {active && <View style={styles.activeDot} />}
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.headerName}>{name}</Text>
                        <Text style={styles.statusText}>{active ? 'Active now' : 'Offline'}</Text>
                    </View>
                </View>

                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.actionBtn}>
                        <Ionicons name="call-outline" size={22} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                        <Ionicons name="videocam-outline" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Chat List */}
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id}
                renderItem={renderMessageBubble}
                contentContainerStyle={styles.messagesList}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    isTyping ? (
                        <View style={styles.typingIndicator}>
                            <Text style={styles.typingText}>{name.split(' ')[0]} is typing...</Text>
                        </View>
                    ) : null
                }
            />

            {/* Input Bar */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.inputBar}>
                    <TouchableOpacity style={styles.attachButton} onPress={handlePickImage} activeOpacity={0.7}>
                        <Ionicons name="add-circle" size={32} color={COLORS.primary} />
                    </TouchableOpacity>

                    <View style={styles.textInputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Message..."
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            placeholderTextColor={COLORS.textSecondary}
                        />
                        <TouchableOpacity onPress={() => { }} style={{ padding: 4 }}>
                            <MaterialIcons name={"emoji-emotions"} size={24} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                        onPress={sendMessage}
                        disabled={!inputText.trim()}
                        activeOpacity={0.8}
                    >
                        {inputText.trim() ? (
                            <Ionicons name="send" size={18} color="#fff" style={{ marginLeft: 2 }} />
                        ) : (
                            <MaterialIcons name="mic" size={24} color="#fff" />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: wp(4), paddingVertical: hp(1.5), backgroundColor: COLORS.surface,
        borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
        elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05
    },
    backButton: { padding: 4 },
    headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
    avatar: { width: 40, height: 40, borderRadius: 20 },
    activeDot: {
        position: 'absolute', bottom: 0, right: 0, width: 12, height: 12,
        borderRadius: 6, backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.surface
    },
    headerName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
    statusText: { fontSize: 11, color: COLORS.success }, // Dynamic based on props later
    headerActions: { flexDirection: 'row' },
    actionBtn: { padding: 8, marginLeft: 4 },

    // Messages
    messagesList: { paddingHorizontal: wp(4), paddingVertical: hp(2) },
    messageBubbleContainer: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end', width: '100%' },
    myMessageContainer: { justifyContent: 'flex-end' },
    otherMessageContainer: { justifyContent: 'flex-start' },
    senderAvatarSmall: { width: 28, height: 28, borderRadius: 14, marginRight: 8, marginBottom: 2 },

    messageBubble: {
        maxWidth: '75%', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 20,
        elevation: 1, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 1 }
    },
    myMessage: {
        backgroundColor: COLORS.primary, borderBottomRightRadius: 4
    },
    otherMessage: {
        backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#F0F0F0'
    },
    imageBubble: { padding: 4, borderRadius: 12 },
    messageImage: { width: 200, height: 150, borderRadius: 8 },
    messageText: { fontSize: 15, lineHeight: 21 },
    myMessageText: { color: '#FFFFFF' },
    otherMessageText: { color: COLORS.textPrimary },

    metaContainer: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginTop: 4 },
    timeText: { fontSize: 10 },
    myTimeText: { color: 'rgba(255,255,255,0.7)' },
    otherTimeText: { color: COLORS.textSecondary },

    typingIndicator: { marginLeft: 40, marginBottom: 16 },
    typingText: { fontSize: 12, color: COLORS.textSecondary, fontStyle: 'italic' },

    // Input Bar
    inputBar: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(3), paddingVertical: hp(1),
        backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: '#F0F0F0'
    },
    attachButton: { padding: 4, marginRight: 4 },
    textInputContainer: {
        flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5',
        borderRadius: 24, paddingHorizontal: 12, marginRight: 8, height: 44
    },
    input: { flex: 1, fontSize: 16, color: COLORS.textPrimary, maxHeight: 100 },
    sendButton: {
        width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary,
        justifyContent: 'center', alignItems: 'center', elevation: 2
    },
    sendButtonDisabled: { backgroundColor: COLORS.secondary }, // Or distinct color
});
