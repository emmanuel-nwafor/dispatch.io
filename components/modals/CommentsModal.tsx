import React, { useState } from 'react';
import {
    View, Text, StyleSheet, Modal, Pressable,
    TextInput, FlatList, ActivityIndicator, Image, Platform,
    TouchableOpacity
} from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Easing } from 'react-native-reanimated';

export default function CommentsModal({ visible, onClose, comments = [] }: any) {
    const [newComment, setNewComment] = useState('');

    return (
        <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
            <View style={styles.container}>
                <AnimatePresence>
                    {visible && (
                        <>
                            <MotiView
                                from={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={[StyleSheet.absoluteFillObject, styles.overlay]}
                            >
                                <Pressable style={{ flex: 1 }} onPress={onClose} />
                            </MotiView>

                            <MotiView
                                from={{ translateY: hp('100%') }}
                                animate={{ translateY: 0 }}
                                exit={{ translateY: hp('100%') }}
                                transition={{ type: 'timing', duration: 400, easing: Easing.bezier(0.33, 1, 0.68, 1) }}
                                style={styles.sheet}
                            >
                                <View style={styles.header}>
                                    <View style={styles.handle} />
                                    <Text style={styles.headerTitle}>{comments.length} Comments</Text>
                                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                        <Ionicons name="close" size={24} color="white" />
                                    </TouchableOpacity>
                                </View>

                                <FlatList
                                    data={comments}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <View style={styles.commentItem}>
                                            <Image source={{ uri: `https://ui-avatars.com/api/?name=${item.user}` }} style={styles.commentAvatar} />
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.commentUser}>{item.user || 'User'}</Text>
                                                <Text style={styles.commentText}>{item.text || item.content}</Text>
                                            </View>
                                        </View>
                                    )}
                                    ListEmptyComponent={<Text style={styles.emptyText}>No comments yet. Be the first!</Text>}
                                    style={{ height: hp('50%') }}
                                />

                                <View style={[styles.inputContainer, { marginBottom: Platform.OS === 'ios' ? hp('4%') : hp('2%') }]}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Add a comment..."
                                        placeholderTextColor="#999"
                                        value={newComment}
                                        onChangeText={setNewComment}
                                    />
                                    <TouchableOpacity style={styles.sendBtn}>
                                        <Ionicons name="arrow-up-circle" size={32} color="#006400" />
                                    </TouchableOpacity>
                                </View>
                            </MotiView>
                        </>
                    )}
                </AnimatePresence>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-end' },
    overlay: { backgroundColor: 'rgba(0,0,0,0.6)' },
    sheet: {
        backgroundColor: '#121212',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingHorizontal: wp('5%'),
        height: hp('70%')
    },
    header: { alignItems: 'center', paddingVertical: 15 },
    handle: { width: 40, height: 5, backgroundColor: '#333', borderRadius: 10, marginBottom: 10 },
    headerTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    closeBtn: { position: 'absolute', right: 0, top: 15 },
    commentItem: { flexDirection: 'row', marginBottom: 20, alignItems: 'flex-start' },
    commentAvatar: { width: 35, height: 35, borderRadius: 17.5, marginRight: 12 },
    commentUser: { color: '#999', fontSize: 12, marginBottom: 2 },
    commentText: { color: 'white', fontSize: 14 },
    emptyText: { color: '#666', textAlign: 'center', marginTop: 50 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 0.5, borderTopColor: '#333', paddingTop: 10 },
    input: { flex: 1, backgroundColor: '#222', borderRadius: 20, paddingHorizontal: 15, color: 'white', height: 45 },
    sendBtn: { marginLeft: 10 }
});