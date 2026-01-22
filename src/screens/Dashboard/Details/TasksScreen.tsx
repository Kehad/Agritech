import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, hp, wp } from 'components/utils';
import { useNavigation } from '@react-navigation/native';

interface Task {
    id: string;
    title: string;
    date: string;
    priority: 'High' | 'Medium' | 'Low';
    completed: boolean;
}

const TasksScreen = () => {
    const navigation = useNavigation();
    const [filter, setFilter] = useState<'All' | 'High' | 'Incomplete'>('All');

    // Mock Data
    const [tasks, setTasks] = useState<Task[]>([
        { id: '1', title: 'Apply Fertilizer to Zone A', date: 'Today, 2:00 PM', priority: 'High', completed: false },
        { id: '2', title: 'Inspect Maize for Armyworm', date: 'Tomorrow, 9:00 AM', priority: 'Medium', completed: false },
        { id: '3', title: 'Repair Irrigation Pump', date: 'Jan 24, 10:00 AM', priority: 'High', completed: true },
        { id: '4', title: 'Buy Herbicide', date: 'Jan 25, 4:00 PM', priority: 'Low', completed: false },
        { id: '5', title: 'Meeting with Extension Officer', date: 'Jan 28, 11:00 AM', priority: 'Medium', completed: false },
    ]);

    const toggleTask = (id: string) => {
        setTasks(current =>
            current.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
        );
    };

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'High': return COLORS.error;
            case 'Medium': return COLORS.secondary; // Orange-ish or secondary
            case 'Low': return COLORS.success;
            default: return COLORS.textSecondary;
        }
    };

    const filteredTasks = tasks.filter(t => {
        if (filter === 'High') return t.priority === 'High';
        if (filter === 'Incomplete') return !t.completed;
        return true;
    });

    const TaskItem = ({ item }: { item: Task }) => (
        <View style={styles.taskItem}>
            <TouchableOpacity
                style={[styles.checkbox, item.completed && styles.checkboxChecked]}
                onPress={() => toggleTask(item.id)}
            >
                {item.completed && <MaterialIcons name="check" size={16} color="#fff" />}
            </TouchableOpacity>

            <View style={{ flex: 1, marginHorizontal: 12 }}>
                <Text style={[styles.taskTitle, item.completed && styles.completedText]}>{item.title}</Text>
                <View style={styles.taskMeta}>
                    <MaterialIcons name="event" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.taskDate}>{item.date}</Text>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) + '20' }]}>
                        <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>{item.priority}</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity>
                <MaterialIcons name="more-vert" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tasks</Text>
                <TouchableOpacity style={styles.addButton}>
                    <MaterialIcons name="add" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            {/* Filter Tabs */}
            <View style={styles.tabs}>
                {['All', 'High', 'Incomplete'].map(f => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.tab, filter === f && styles.activeTab]}
                        onPress={() => setFilter(f as any)}
                    >
                        <Text style={[styles.tabText, filter === f && styles.activeTabText]}>{f}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>
                    {filter === 'All' ? 'All Tasks' : filter === 'High' ? 'High Priority' : 'To Do'}
                </Text>

                {filteredTasks.length === 0 ? (
                    <View style={styles.emptyState}>
                        <MaterialIcons name="assignment-turned-in" size={64} color={COLORS.border} />
                        <Text style={styles.emptyText}>No tasks found</Text>
                    </View>
                ) : (
                    filteredTasks.map(task => (
                        <TaskItem key={task.id} item={task} />
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: wp(4), paddingVertical: hp(2), backgroundColor: COLORS.surface,
        borderBottomWidth: 1, borderBottomColor: COLORS.border,
    },
    backButton: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: '600', color: COLORS.textPrimary },
    addButton: { padding: 4 },
    tabs: {
        flexDirection: 'row', padding: wp(4), paddingBottom: 0
    },
    tab: {
        marginRight: 12, paddingVertical: 6, paddingHorizontal: 16,
        borderRadius: 20, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border
    },
    activeTab: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    tabText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '500' },
    activeTabText: { color: '#fff' },
    content: { padding: wp(4) },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textSecondary, marginBottom: hp(2), marginTop: hp(1) },
    taskItem: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
        padding: wp(4), borderRadius: wp(3), marginBottom: hp(1.5),
        shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 1 }, elevation: 1
    },
    checkbox: {
        width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: COLORS.border,
        justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.surface
    },
    checkboxChecked: {
        backgroundColor: COLORS.success, borderColor: COLORS.success
    },
    taskTitle: { fontSize: 16, color: COLORS.textPrimary, fontWeight: '500', marginBottom: 4 },
    completedText: { textDecorationLine: 'line-through', color: COLORS.textSecondary },
    taskMeta: { flexDirection: 'row', alignItems: 'center' },
    taskDate: { fontSize: 12, color: COLORS.textSecondary, marginLeft: 4, marginRight: 12 },
    priorityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    priorityText: { fontSize: 10, fontWeight: '700' },
    emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: hp(10) },
    emptyText: { marginTop: 16, color: COLORS.textSecondary, fontSize: 16 }
});

export default TasksScreen;
