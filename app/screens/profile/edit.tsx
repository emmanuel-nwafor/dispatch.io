import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    useColorScheme,
    KeyboardAvoidingView,
    Platform,
    Image,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/app/constants/Colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { user as userApi } from '@/app/data/api';
import { useUserStore } from '@/hooks/useUserStore';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

export default function EditProfileScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';
    const { user, setUser } = useUserStore();

    // Live preview images (local URIs before upload, or existing remote ones)
    const [avatarPreview, setAvatarPreview] = useState<string>(
        user?.avatar || ''
    );
    const [coverPreview, setCoverPreview] = useState<string>(
        user?.coverImage || ''
    );
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        fullName: user?.profile?.fullName || user?.recruiterProfile?.companyName || '',
        headline: user?.profile?.headline || user?.recruiterProfile?.industry || '',
        bio: user?.profile?.bio || (user?.recruiterProfile as any)?.about || '',
        phone: user?.profile?.phone || '',
        location: user?.profile?.location || user?.recruiterProfile?.location || '',
        companySize: user?.recruiterProfile?.companySize || '',
        companyWebsite: user?.recruiterProfile?.companyWebsite || '',
        skills: user?.profile?.skills || [] as string[],
        skillInput: '',
    });

    const update = (key: string, val: string) => setFormData(prev => ({ ...prev, [key]: val }));

    // ── Image Upload ────────────────────────────────────────────────────────
    const handlePickImage = async (type: 'avatar' | 'coverImage') => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: type === 'avatar' ? [1, 1] : [16, 9],
                quality: 0.85,
            });
            if (result.canceled) return;

            const imageUri = result.assets[0].uri;

            // Show preview immediately
            if (type === 'avatar') {
                setAvatarPreview(imageUri);
                setUploadingAvatar(true);
            } else {
                setCoverPreview(imageUri);
                setUploadingCover(true);
            }

            const fileName = imageUri.split('/').pop();
            const fileType = fileName?.split('.').pop();
            const fd = new FormData();
            fd.append('file', { uri: imageUri, name: fileName, type: `image/${fileType}` } as any);
            fd.append('type', type);

            const res = await userApi.uploadImage(fd);
            if (res.success) {
                setUser(res.user);
                // Update preview to the confirmed remote URL
                if (type === 'avatar') setAvatarPreview(res.user.avatar || imageUri);
                else setCoverPreview(res.user.coverImage || imageUri);
                Toast.show({ type: 'success', text1: type === 'avatar' ? 'Profile photo updated!' : 'Cover photo updated!' });
            }
        } catch (err: any) {
            Toast.show({ type: 'error', text1: 'Upload Failed', text2: err.message });
        } finally {
            setUploadingAvatar(false);
            setUploadingCover(false);
        }
    };

    // ── Skills ──────────────────────────────────────────────────────────────
    const addSkill = () => {
        const skill = formData.skillInput.trim();
        if (skill && !formData.skills.includes(skill)) {
            setFormData(prev => ({ ...prev, skills: [...prev.skills, skill], skillInput: '' }));
        }
    };
    const removeSkill = (skill: string) => {
        setFormData(prev => ({ ...prev, skills: prev.skills.filter((s: string) => s !== skill) }));
    };

    // ── Save ────────────────────────────────────────────────────────────────
    const handleSave = async () => {
        setSaving(true);
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            const updateData: any = { ...formData };
            delete updateData.skillInput;
            if (user?.role === 'recruiter') {
                updateData.companyName = formData.fullName;
                updateData.industry = formData.headline;
                updateData.about = formData.bio;
            }
            const res = await userApi.updateProfile(updateData);
            if (res.success) {
                setUser(res.user);
                Toast.show({ type: 'success', text1: 'Profile updated!' });
                router.back();
            }
        } catch (err: any) {
            Toast.show({ type: 'error', text1: 'Update Failed', text2: err.message });
        } finally {
            setSaving(false);
        }
    };

    const borderCol = isDark ? '#2c2c2e' : '#e9ecef';
    const cardBg = isDark ? '#1c1c1e' : '#ffffff';
    const subText = isDark ? '#8e8e93' : '#6b7280';
    const inputBg = isDark ? '#2c2c2e' : '#f3f4f6';

    return (
        <SafeAreaView style={[styles.root, { backgroundColor: isDark ? '#000' : '#f4f4f5' }]} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* ── Top Bar ── */}
            <View style={[styles.topBar, { backgroundColor: isDark ? '#000' : '#f4f4f5' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.topBarBtn}>
                    <Ionicons name="close" size={26} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.topBarTitle, { color: theme.text }]}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave} disabled={saving} style={[styles.saveBtn, { backgroundColor: theme.brand }]}>
                    {saving
                        ? <ActivityIndicator size="small" color="#fff" />
                        : <Text style={styles.saveBtnText}>Save</Text>
                    }
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >

                    {/* ── Banner / Cover ── */}
                    <View style={[styles.card, { backgroundColor: cardBg, borderColor: borderCol }]}>
                        <Text style={[styles.sectionLabel, { color: theme.text }]}>Photos</Text>

                        {/* Cover photo */}
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => handlePickImage('coverImage')}
                            style={[styles.coverContainer, { backgroundColor: isDark ? '#1a1a1a' : '#e2e8f0' }]}
                        >
                            {coverPreview
                                ? <Image source={{ uri: coverPreview }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                                : null
                            }
                            <View style={styles.coverOverlay}>
                                {uploadingCover
                                    ? <ActivityIndicator color="#fff" />
                                    : (
                                        <View style={styles.cameraChip}>
                                            <Ionicons name="camera" size={18} color="#fff" />
                                            <Text style={styles.cameraChipText}>
                                                {coverPreview ? 'Change cover' : 'Add cover photo'}
                                            </Text>
                                        </View>
                                    )
                                }
                            </View>
                        </TouchableOpacity>

                        {/* Avatar */}
                        <View style={styles.avatarRow}>
                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={() => handlePickImage('avatar')}
                                style={[styles.avatarWrapper, { borderColor: isDark ? '#000' : '#f4f4f5' }]}
                            >
                                {avatarPreview
                                    ? <Image source={{ uri: avatarPreview }} style={styles.avatarImg} />
                                    : (
                                        <View style={[styles.avatarPlaceholder, { backgroundColor: isDark ? '#2c2c2e' : '#e2e8f0' }]}>
                                            <Ionicons name="person" size={36} color={subText} />
                                        </View>
                                    )
                                }
                                <View style={styles.avatarEditBadge}>
                                    {uploadingAvatar
                                        ? <ActivityIndicator size="small" color="#fff" />
                                        : <Ionicons name="camera" size={14} color="#fff" />
                                    }
                                </View>
                            </TouchableOpacity>
                            <Text style={[styles.avatarHint, { color: subText }]}>
                                Tap the photo to change it
                            </Text>
                        </View>
                    </View>

                    {/* ── Basic Info ── */}
                    <View style={[styles.card, { backgroundColor: cardBg, borderColor: borderCol }]}>
                        <Text style={[styles.sectionLabel, { color: theme.text }]}>Basic Info</Text>

                        <Field label={user?.role === 'recruiter' ? 'Company Name' : 'Full Name'} color={subText}>
                            <TextInput
                                style={[styles.input, { backgroundColor: inputBg, color: theme.text }]}
                                value={formData.fullName}
                                placeholder="e.g. John Doe"
                                placeholderTextColor={subText}
                                onChangeText={t => update('fullName', t)}
                            />
                        </Field>

                        <Field label={user?.role === 'recruiter' ? 'Industry' : 'Headline'} color={subText}>
                            <TextInput
                                style={[styles.input, { backgroundColor: inputBg, color: theme.text }]}
                                value={formData.headline}
                                placeholder={user?.role === 'recruiter' ? 'e.g. Technology' : 'e.g. Senior Engineer at Google'}
                                placeholderTextColor={subText}
                                onChangeText={t => update('headline', t)}
                            />
                        </Field>

                        <Field label="About" color={subText}>
                            <View style={{ position: 'relative' }}>
                                <TextInput
                                    multiline
                                    numberOfLines={5}
                                    style={[styles.input, { backgroundColor: inputBg, color: theme.text, height: 110, textAlignVertical: 'top' }]}
                                    value={formData.bio}
                                    placeholder="Tell the community about yourself..."
                                    placeholderTextColor={subText}
                                    onChangeText={t => update('bio', t)}
                                    maxLength={300}
                                />
                                <Text style={[styles.charCount, { color: subText }]}>{formData.bio.length}/300</Text>
                            </View>
                        </Field>

                        <Field label="Location" color={subText}>
                            <View style={[styles.inputRow, { backgroundColor: inputBg }]}>
                                <Ionicons name="location-outline" size={18} color={subText} style={{ marginRight: 8 }} />
                                <TextInput
                                    style={[styles.inputInner, { color: theme.text }]}
                                    value={formData.location}
                                    placeholder="City, Country"
                                    placeholderTextColor={subText}
                                    onChangeText={t => update('location', t)}
                                />
                            </View>
                        </Field>

                        <Field label="Phone" color={subText} isLast>
                            <View style={[styles.inputRow, { backgroundColor: inputBg }]}>
                                <Ionicons name="call-outline" size={18} color={subText} style={{ marginRight: 8 }} />
                                <TextInput
                                    style={[styles.inputInner, { color: theme.text }]}
                                    value={formData.phone}
                                    placeholder="+1 234 567 890"
                                    placeholderTextColor={subText}
                                    keyboardType="phone-pad"
                                    onChangeText={t => update('phone', t)}
                                />
                            </View>
                        </Field>
                    </View>

                    {/* ── Recruiter-specific ── */}
                    {user?.role === 'recruiter' && (
                        <View style={[styles.card, { backgroundColor: cardBg, borderColor: borderCol }]}>
                            <Text style={[styles.sectionLabel, { color: theme.text }]}>Company Details</Text>

                            <Field label="Company Website" color={subText}>
                                <View style={[styles.inputRow, { backgroundColor: inputBg }]}>
                                    <Ionicons name="globe-outline" size={18} color={subText} style={{ marginRight: 8 }} />
                                    <TextInput
                                        style={[styles.inputInner, { color: theme.text }]}
                                        value={formData.companyWebsite}
                                        placeholder="https://company.com"
                                        placeholderTextColor={subText}
                                        autoCapitalize="none"
                                        onChangeText={t => update('companyWebsite', t)}
                                    />
                                </View>
                            </Field>

                            <Field label="Company Size" color={subText} isLast>
                                <View style={[styles.inputRow, { backgroundColor: inputBg }]}>
                                    <Ionicons name="people-outline" size={18} color={subText} style={{ marginRight: 8 }} />
                                    <TextInput
                                        style={[styles.inputInner, { color: theme.text }]}
                                        value={formData.companySize}
                                        placeholder="e.g. 50–200 employees"
                                        placeholderTextColor={subText}
                                        onChangeText={t => update('companySize', t)}
                                    />
                                </View>
                            </Field>
                        </View>
                    )}

                    {/* ── Seeker Skills ── */}
                    {user?.role === 'seeker' && (
                        <View style={[styles.card, { backgroundColor: cardBg, borderColor: borderCol }]}>
                            <Text style={[styles.sectionLabel, { color: theme.text }]}>Skills</Text>
                            <Text style={[styles.hint, { color: subText }]}>Add skills that showcase your expertise</Text>

                            <View style={[styles.inputRow, { backgroundColor: inputBg, marginBottom: 12 }]}>
                                <TextInput
                                    style={[styles.inputInner, { color: theme.text, flex: 1 }]}
                                    value={formData.skillInput}
                                    placeholder="e.g. React Native"
                                    placeholderTextColor={subText}
                                    onChangeText={t => update('skillInput', t)}
                                    onSubmitEditing={addSkill}
                                    returnKeyType="done"
                                />
                                <TouchableOpacity onPress={addSkill} style={[styles.addSkillBtn, { backgroundColor: theme.brand }]}>
                                    <Ionicons name="add" size={18} color="#fff" />
                                </TouchableOpacity>
                            </View>

                            {formData.skills.length > 0 && (
                                <View style={styles.skillsWrap}>
                                    {formData.skills.map((skill: string) => (
                                        <View key={skill} style={[styles.skillChip, { borderColor, backgroundColor: isDark ? '#2c2c2e' : '#f0fdf4' }]}>
                                            <Text style={[styles.skillText, { color: theme.text }]}>{skill}</Text>
                                            <TouchableOpacity onPress={() => removeSkill(skill)} style={{ marginLeft: 6 }}>
                                                <Ionicons name="close" size={14} color={subText} />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}

                    <View style={{ height: 32 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// Tiny field wrapper
function Field({ label, color, children, isLast }: { label: string; color: string; children: React.ReactNode; isLast?: boolean }) {
    return (
        <View style={{ marginBottom: isLast ? 0 : 16 }}>
            <Text style={{ fontFamily: 'Outfit-Bold', fontSize: 12, color, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {label}
            </Text>
            {children}
        </View>
    );
}

const borderColor = '#e9ecef';

const styles = StyleSheet.create({
    root: { flex: 1 },

    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    topBarBtn: { padding: 4 },
    topBarTitle: { fontFamily: 'Outfit-Bold', fontSize: 17 },
    saveBtn: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
        minWidth: 64,
        alignItems: 'center',
    },
    saveBtnText: { fontFamily: 'Outfit-Bold', fontSize: 14, color: '#fff' },

    scrollContent: { paddingHorizontal: 16, paddingBottom: 40, paddingTop: 8, gap: 12 },

    card: {
        borderRadius: 16,
        padding: 16,
        borderWidth: StyleSheet.hairlineWidth,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionLabel: {
        fontFamily: 'Outfit-Bold',
        fontSize: 16,
        marginBottom: 16,
    },
    hint: {
        fontFamily: 'Outfit-Regular',
        fontSize: 13,
        marginBottom: 12,
        marginTop: -8,
    },

    // Cover
    coverContainer: {
        width: '100%',
        height: 130,
        borderRadius: 12,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coverOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.28)',
    },
    cameraChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.55)',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    cameraChipText: { color: '#fff', fontFamily: 'Outfit-Medium', fontSize: 13 },

    // Avatar
    avatarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 14,
        gap: 14,
    },
    avatarWrapper: {
        width: 76,
        height: 76,
        borderRadius: 38,
        borderWidth: 3,
        overflow: 'hidden',
        position: 'relative',
    },
    avatarImg: { width: '100%', height: '100%' },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarEditBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#0a66c2',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    avatarHint: { fontFamily: 'Outfit-Regular', fontSize: 13, flex: 1 },

    // Inputs
    input: {
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontFamily: 'Outfit-Medium',
        fontSize: 15,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    inputInner: {
        flex: 1,
        fontFamily: 'Outfit-Medium',
        fontSize: 15,
        padding: 0,
    },
    charCount: {
        position: 'absolute',
        bottom: 8,
        right: 12,
        fontFamily: 'Outfit-Regular',
        fontSize: 11,
    },

    // Skills
    addSkillBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    skillChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
    },
    skillText: { fontFamily: 'Outfit-Medium', fontSize: 13 },
});
