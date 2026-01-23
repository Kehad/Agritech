import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    FlatList, KeyboardAvoidingView, Platform, Image, LayoutAnimation, UIManager, Alert, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { COLORS, hp, wp } from 'components/utils';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { ChatStackParamList } from '../../navigation/ChatNavigator';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import EmojiPicker, { en } from 'rn-emoji-keyboard';

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
    attachmentUrl?: string; // For images
    audioUri?: string; // For voice
    duration?: string; // For voice
    status: 'sent' | 'delivered' | 'read';
}

export default function ChatDetailScreen() {
    const route = useRoute<ChatDetailRouteProp>();
    const navigation = useNavigation();
    const { id, name, image, active } = route.params || { id: '0', name: 'Unknown', image: 'https://i.pravatar.cc/100', active: false };

    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Hello! How is the maize harvest coming along?', sender: 'other', time: '09:00 AM', type: 'text', status: 'read' },
        { id: '2', text: 'It is going well, thank you. We are expecting a bumper harvest this season.', sender: 'me', time: '09:05 AM', type: 'text', status: 'read' },
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    // Emoji State
    const [isEmojiOpen, setIsEmojiOpen] = useState(false);

    // Audio Recording State
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordTime, setRecordTime] = useState(0);
    const recordTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Audio Playback State
    const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);
    const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);



    // Auto-scroll logic
    useEffect(() => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages, isTyping]); // Scroll when messages change or typing starts

    const startRecording = async () => {
        try {
            console.log('Requesting permissions..');
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status !== 'granted') {
                Alert.alert("Permission Required", "Please allow microphone access to record voice messages.");
                return;
            }
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            console.log('Starting recording..');
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            setIsRecording(true);
            setRecordTime(0);
            recordTimerRef.current = setInterval(() => {
                setRecordTime(prev => prev + 1);
            }, 1000);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecording = async () => {
        if (!recording) return;
        setIsRecording(false);
        if (recordTimerRef.current) clearInterval(recordTimerRef.current);

        console.log('Stopping recording..');
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);
        console.log('Recording stopped and stored at', uri);

        if (uri) {
            const mins = Math.floor(recordTime / 60);
            const secs = recordTime % 60;
            const durationStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

            const newMessage: Message = {
                id: Date.now().toString(),
                text: 'Voice Message',
                sender: 'me',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'voice',
                audioUri: uri,
                duration: durationStr,
                status: 'sent'
            };
            setMessages(prev => [...prev, newMessage]);
        }
    };

    const handlePlayAudio = async (uri: string, id: string) => {
        try {
            // Stop currently playing sound if any
            if (currentSound) {
                await currentSound.unloadAsync();
                setCurrentSound(null);
                setPlayingMessageId(null);

                // If clicking the same message, just stop it (toggle off)
                if (playingMessageId === id) {
                    return;
                }
            }

            console.log('Loading Sound');
            const { sound } = await Audio.Sound.createAsync(
                { uri },
                { shouldPlay: true }
            );
            setCurrentSound(sound);
            setPlayingMessageId(id);

            // Handle playback completion
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    setPlayingMessageId(null);
                    setCurrentSound(null);
                    sound.unloadAsync(); // Unload when done
                }
            });

            console.log('Playing Sound');
            await sound.playAsync();

        } catch (error) {
            console.error('Error playing sound', error);
            Alert.alert("Playback Error", "Could not play audio message.");
        }
    };

    const formatRecordTime = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const handleEmojiSelect = (emojiObject: { emoji: string }) => {
        setInputText(prev => prev + emojiObject.emoji);
        // Keep picker open or close? Typically keep open for multiple emojis, usually closed on explicit close.
        // setIsEmojiOpen(false); // Optional
    };

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
        setIsEmojiOpen(false);

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
                    item.type === 'image' && styles.imageBubble,
                    item.type === 'voice' && styles.voiceBubble
                ]}>
                    {item.type === 'image' ? (
                        <Image source={{ uri: item.attachmentUrl }} style={styles.messageImage} />
                    ) : item.type === 'voice' ? (
                        <View style={styles.voiceContent}>
                            <TouchableOpacity
                                style={styles.playButton}
                                onPress={() => item.audioUri && handlePlayAudio(item.audioUri, item.id)}
                            >
                                <Ionicons
                                    name={playingMessageId === item.id ? "pause" : "play"}
                                    size={20}
                                    color={isMe ? COLORS.primary : COLORS.textSecondary}
                                />
                            </TouchableOpacity>
                            <View style={styles.audioWaveform}>
                                {/* Simulated Waveform */}
                                {[...Array(6)].map((_, i) => (
                                    <View
                                        key={i}
                                        style={[
                                            styles.bar,
                                            {
                                                height: [10, 16, 8, 20, 12, 6][i],
                                                backgroundColor: isMe ? 'rgba(255,255,255,0.7)' : COLORS.primary + '80'
                                            }
                                        ]}
                                    />
                                ))}
                            </View>
                            <Text style={[styles.durationText, isMe ? { color: '#fff' } : { color: COLORS.textSecondary }]}>
                                {item.duration}
                            </Text>
                        </View>
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

    const handleCall = () => {
        Alert.alert(
            'Call',
            'Calling feature not available for now',
        );
    };

    const handleVideoCall = () => {
        Alert.alert(
            'Video Call',
            'Do you want to make a video call?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Call',
                    onPress: () => console.log('Call Pressed'),
                },
            ],
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
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
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleCall()}>
                        <Ionicons name="call-outline" size={22} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleVideoCall()}>
                        <Ionicons name="videocam-outline" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>
            </View>

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

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                {/* Recording UI Overlay */}
                {isRecording ? (
                    <View style={styles.recordingContainer}>
                        <View style={styles.recordingIndicator}>
                            <View style={styles.blinkDot} />
                            <Text style={styles.recordingTimer}>{formatRecordTime(recordTime)}</Text>
                        </View>
                        <Text style={styles.recordingText}>Release to send, swipe to cancel</Text>
                        <TouchableOpacity onPress={stopRecording} style={styles.stopButton}>
                            <Ionicons name="stop" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.inputBar}>
                        <TouchableOpacity style={styles.attachButton} onPress={handlePickImage}>
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
                                onFocus={() => setIsEmojiOpen(false)}
                            />
                            <TouchableOpacity onPress={() => setIsEmojiOpen(!isEmojiOpen)} style={{ padding: 4 }}>
                                <MaterialIcons
                                    name={isEmojiOpen ? "keyboard" : "emoji-emotions"}
                                    size={24}
                                    color={isEmojiOpen ? COLORS.primary : COLORS.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.sendButton,
                                (!inputText.trim() && !isRecording) ? styles.micButton : {} // Mic style default
                            ]}
                            onPress={inputText.trim() ? sendMessage : startRecording}
                        // Allow long press for recording in future, click to start for now
                        >
                            {inputText.trim() ? (
                                <Ionicons name="send" size={18} color="#fff" style={{ marginLeft: 2 }} />
                            ) : (
                                <MaterialIcons name="mic" size={24} color="#fff" />
                            )}
                        </TouchableOpacity>
                    </View>
                )}

                {/* Emoji Picker Region */}
                <EmojiPicker
                    open={isEmojiOpen}
                    onClose={() => setIsEmojiOpen(false)}
                    onEmojiSelected={handleEmojiSelect}
                    categoryPosition="bottom"
                    translation={en}
                    enableSearchBar
                />
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
    statusText: { fontSize: 11, color: COLORS.success },
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

    voiceBubble: { width: 180, flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
    voiceContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    playButton: {
        width: 30, height: 30, borderRadius: 15, backgroundColor: '#fff',
        justifyContent: 'center', alignItems: 'center', marginRight: 10
    },
    audioWaveform: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8, height: 20, justifyContent: 'space-evenly' },
    bar: { width: 3, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 1 },
    durationText: { fontSize: 12, fontWeight: '500' },

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
    micButton: { backgroundColor: COLORS.primary }, // Keep generic or specific color

    // Recording UI
    recordingContainer: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: wp(4), paddingVertical: hp(1.5), backgroundColor: COLORS.surface,
        borderTopWidth: 1, borderTopColor: COLORS.border
    },
    recordingIndicator: { flexDirection: 'row', alignItems: 'center' },
    blinkDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.error, marginRight: 8 },
    recordingTimer: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
    recordingText: { fontSize: 14, color: COLORS.textSecondary },
    stopButton: { padding: 8, backgroundColor: COLORS.error, borderRadius: 20 },
    chatBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007AFF', // iMessage blue
        padding: 15,
        borderRadius: 20,
        borderBottomRightRadius: 2, // Chat bubble tail effect
        marginBottom: 15,
        alignSelf: 'flex-end', // Align to right like "sent" messages
        maxWidth: '80%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    bubbleContent: {
        flex: 1,
    },
    waveformSimulator: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
        marginBottom: 5,
    },
    waveformBar: {
        width: 3,
        backgroundColor: '#fff',
        marginHorizontal: 1,
        borderRadius: 2,
    },
    metaData: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timestampText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        marginLeft: 10,
    },
});
