import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Platform,
    RefreshControl,
    Modal,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Colors } from '@/app/constants/Colors';
import { useColorScheme } from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

// API & Components
import { user as userApi, posts as postsApi, reels as reelsApi, jobs as jobsApi, User, Post, Reel, Job, FeedItemData } from '@/app/data/api';
import RecruiterProfileSkeleton from '@/components/skeletons/RecruiterProfileSkeleton';
import FeedItem from '@/components/home/FeedItem';
import JobCard from '@/components/JobCard';
import { useUserStore } from '@/hooks/useUserStore';

export default function ProfileDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const currentUser = useUserStore(state => state.user);

    const isDark = colorScheme === 'dark';
    const isMe = currentUser?._id === id || currentUser?.username === id || id === 'me';
    const [activeTab, setActiveTab] = useState('About');
    const [profileData, setProfileData] = useState<User | null>(null);
    const [userPosts, setUserPosts] = useState<FeedItemData[]>([]);
    const [userReels, setUserReels] = useState<Reel[]>([]);
    const [userJobs, setUserJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const [viewerVisible, setViewerVisible] = useState(false);
    const [viewerImage, setViewerImage] = useState('');
    const [isUpdatingImage, setIsUpdatingImage] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    const transformPostData = (items: any[]): FeedItemData[] => {
        return items.map(item => ({
            id: item._id,
            userId: item.creatorId?._id || item.creatorId,
            type: item.videoUrl ? 'reel' : 'post',
            user: item.creatorId?.profile?.fullName || item.creatorId?.recruiterProfile?.companyName || 'User',
            handle: `@${(item.creatorId?.username || 'user')}`,
            avatar: item.creatorId?.avatar || `https://ui-avatars.com/api/?name=${(item.creatorId?.profile?.fullName || 'User').replace(/\s+/g, '+')}`,
            time: '2h',
            content: item.content || item.description || '',
            isLiked: item.likes?.includes(currentUser?._id),
            stats: {
                comments: String(item.comments?.length || 0),
                reposts: String(item.resharesCount || 0),
                likes: String(item.likes?.length || 0)
            },
            attachments: item.images?.map((img: string) => ({ type: 'image', url: img })) || []
        }));
    };

    const fetchUser = async (isRefreshing = false) => {
        try {
            if (isRefreshing) setRefreshing(true);
            else setLoading(true);

            const res = await userApi.getProfile(id as string);

            if (res.success) {
                setProfileData(res.user);
                setIsFollowing(!!res.user.followers?.includes(currentUser?._id));
                setFollowerCount(res.user.followers?.length || 0);
                setFollowingCount(res.user.following?.length || 0);

                // Fetch associated content
                const [postsRes, reelsRes] = await Promise.all([
                    postsApi.getByUser(id as string),
                    reelsApi.getByUser(id as string)
                ]);

                if (postsRes.success) setUserPosts(transformPostData(postsRes.data));
                if (reelsRes.success) setUserReels(reelsRes.data);

                if (res.user.role === 'recruiter') {
                    const jobsRes = await jobsApi.getAll({ recruiterId: id });
                    if (jobsRes.success) setUserJobs(jobsRes.jobs);
                }

                setError('');
            } else {
                setError('Failed to load profile');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id]);

    const onRefresh = useCallback(() => {
        fetchUser(true);
    }, [id]);

    const handleUpdateImage = async (type: 'avatar' | 'coverImage') => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: type === 'avatar' ? [1, 1] : [16, 9],
                quality: 0.8,
            });

            if (!result.canceled) {
                setIsUpdatingImage(true);
                const formData = new FormData();
                const imageUri = result.assets[0].uri;
                const fileName = imageUri.split('/').pop();
                const fileType = fileName?.split('.').pop();

                formData.append('file', {
                    uri: imageUri,
                    name: fileName,
                    type: `image/${fileType}`,
                } as any);
                formData.append('type', type);

                const res = await userApi.uploadImage(formData);
                if (res.success) {
                    setProfileData(prev => prev ? { ...prev, [type]: res.imageUrl } : null);
                    useUserStore.getState().setUser(res.user);
                    Toast.show({ type: 'success', text1: 'Success', text2: 'Profile updated!' });
                }
            }
        } catch (error: any) {
            Toast.show({ type: 'error', text1: 'Upload Failed', text2: error.message });
        } finally {
            setIsUpdatingImage(false);
        }
    };

    const handleFollowToggle = async () => {
        if (!profileData) return;
        try {
            const wasFollowing = isFollowing;
            setIsFollowing(!wasFollowing);
            setFollowerCount(prev => wasFollowing ? prev - 1 : prev + 1);

            const res = wasFollowing 
                ? await userApi.unfollow(profileData?._id)
                : await userApi.follow(profileData?._id);

            if (!res.success) {
                // Rollback on failure
                setIsFollowing(wasFollowing);
                setFollowerCount(prev => wasFollowing ? prev + 1 : prev - 1);
                Toast.show({ type: 'error', text1: 'Error', text2: res.message });
            }
        } catch (error: any) {
            Toast.show({ type: 'error', text1: 'Error', text2: error.message });
        }
    };

    if (loading || refreshing) {
        return <RecruiterProfileSkeleton />;
    }

    if (error || !profileData) {
        return (
            <View className="flex-1 justify-center items-center px-10" style={{ backgroundColor: theme.background }}>
                <Text className="text-center mb-4" style={{ color: theme.text, fontFamily: 'Outfit-Medium' }}>
                    {error || 'Profile not found'}
                </Text>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="px-8 py-3 rounded-full"
                    style={{ backgroundColor: theme.brand }}
                >
                    <Text className="text-white font-bold" style={{ fontFamily: 'Outfit-Bold' }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const isRecruiter = profileData.role === 'recruiter';
    const profileImage = profileData.avatar || `https://ui-avatars.com/api/?name=${(profileData.profile?.fullName || profileData.username || 'User').replace(/\s+/g, '+')}`;
    const coverImage = profileData.coverImage || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1000';

    return (
        <View className="flex-1" style={{ backgroundColor: theme.background }}>
            <StatusBar style="light" />

            {/* Header Overlay */}
            <View
                className="absolute z-50 w-full flex-row justify-between px-5"
                style={{ top: Platform.OS === 'ios' ? hp('6%') : hp('4%') }}
            >
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-black/40 items-center justify-center">
                    <Ionicons name="arrow-back" size={wp('5.5%')} color="#fff" />
                </TouchableOpacity>
                <View className="flex-row gap-x-3">
                    <TouchableOpacity className="w-10 h-10 rounded-full bg-black/40 items-center justify-center">
                        <Feather name="search" size={wp('5%')} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity className="w-10 h-10 rounded-full bg-black/40 items-center justify-center">
                        <Ionicons name="ellipsis-horizontal" size={wp('5%')} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[1]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.brand} // Dark Green or Brand color
                        colors={[theme.brand]}
                    />
                }
            >
                {/* Section 1: Profile Top */}
                <View style={{ backgroundColor: theme.background }}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { setViewerImage(coverImage); setViewerVisible(true); }}>
                        <Image
                            source={{ uri: coverImage }}
                            className="w-full"
                            style={{ height: hp('22%'), backgroundColor: '#27272a' }}
                        />
                        {isMe && (
                            <TouchableOpacity 
                                onPress={() => handleUpdateImage('coverImage')}
                                className="absolute right-4 bottom-4 w-10 h-10 rounded-full bg-black/50 items-center justify-center"
                            >
                                <Ionicons name="camera" size={20} color="white" />
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>
                    <View className="flex-row justify-between items-end px-4 -mt-12">
                        <TouchableOpacity 
                            activeOpacity={0.9} 
                            onPress={() => { setViewerImage(profileImage); setViewerVisible(true); }}
                            className="p-1 rounded-3xl" 
                            style={{ backgroundColor: theme.background }}
                        >
                            <Image
                                source={{ uri: profileImage }}
                                className="rounded-2xl bg-zinc-800"
                                style={{ width: wp('24%'), height: wp('24%') }}
                            />
                            {isMe && (
                                <View className="absolute inset-0 items-center justify-center bg-black/30 rounded-2xl">
                                    <TouchableOpacity onPress={() => handleUpdateImage('avatar')}>
                                        <Ionicons name="camera" size={24} color="white" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="px-6 py-2 rounded-full mb-1"
                            style={{ 
                                backgroundColor: isMe ? theme.brand : (isFollowing ? 'transparent' : theme.text),
                                borderWidth: !isMe && isFollowing ? 1 : 0,
                                borderColor: theme.text
                            }}
                            onPress={() => isMe ? router.push('/screens/profile/edit') : handleFollowToggle()}
                        >
                            <Text style={{ 
                                color: isMe ? '#000' : (isFollowing ? theme.text : theme.background), 
                                fontFamily: 'Outfit-Bold' 
                            }}>
                                {isMe ? 'Edit Profile' : (isFollowing ? 'Unfollow' : 'Follow')}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className="px-5 mt-3">
                        <View className="flex-row items-center">
                            <Text className="text-2xl" style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>
                                {profileData.profile?.fullName || 'User'}
                            </Text>
                            {isRecruiter && (
                                <View className="ml-2 px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20">
                                    <Text className="text-green-500 text-[10px]" style={{ fontFamily: 'Outfit-Bold' }}>RECRUITER</Text>
                                </View>
                            )}
                        </View>
                        <Text className="text-zinc-500" style={{ fontFamily: 'Outfit-Regular' }}>@{profileData.email.split('@')[0]}</Text>

                        <Text className="mt-3 text-base leading-5" style={{ color: theme.text, fontFamily: 'Outfit-Regular' }}>
                            {profileData.profile?.bio || 'Professional at Dispatch.io'}
                        </Text>

                        <View className="flex-row mt-4 gap-x-5">
                            <View className="flex-row items-center">
                                <Ionicons name="location-outline" size={16} color="#71717a" />
                                <Text className="text-zinc-500 ml-1 text-sm">{profileData.profile?.location || 'Remote'}</Text>
                            </View>
                            <View className="flex-row items-center">
                                <Ionicons name="calendar-outline" size={16} color="#71717a" />
                                <Text className="text-zinc-500 ml-1 text-sm">Joined {new Date(profileData.createdAt || Date.now()).getFullYear()}</Text>
                            </View>
                        </View>

                    <View className="flex-row mt-4 mb-4 gap-x-4">
                        <TouchableOpacity onPress={() => router.push(`/screens/profile/follow?id=${profileData._id}&type=following`)}>
                            <Text style={{ color: theme.text, fontFamily: 'Outfit-Bold' }}>{followingCount} <Text className="text-zinc-500 font-normal">Following</Text></Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push(`/screens/profile/follow?id=${profileData._id}&type=followers`)}>
                            <Text style={{ color: theme.text, fontFamily: 'Outfit-Bold' }}>{followerCount} <Text className="text-zinc-500 font-normal">Followers</Text></Text>
                        </TouchableOpacity>
                        <Text style={{ color: theme.text, fontFamily: 'Outfit-Bold' }}>{profileData.appliedJobsCount || 0} <Text className="text-zinc-500 font-normal">Applications</Text></Text>
                    </View>
                    </View>
                </View>

                {/* Section 2: STICKY TABS */}
                <View
                    className="flex-row border-b"
                    style={{
                        borderColor: isDark ? '#2f3336' : '#eff3f4',
                        backgroundColor: theme.background
                    }}
                >
                    {['About', 'Jobs', 'Posts', 'Media'].map((tab) => (
                        <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} className="flex-1 items-center py-4">
                            <Text style={{
                                fontFamily: activeTab === tab ? 'Outfit-Bold' : 'Outfit-Medium',
                                color: activeTab === tab ? theme.text : '#71717a',
                                fontSize: wp('3.8%')
                            }}>{tab}</Text>
                            {activeTab === tab && (
                                <View className="absolute bottom-0 w-12 h-1 rounded-full" style={{ backgroundColor: theme.brand }} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Section 3: Tab Content */}
                <View className="px-5 py-6" style={{ minHeight: hp('50%'), backgroundColor: theme.background }}>
                    {activeTab === 'About' ? (
                        <View>
                            <Text className="text-lg mb-2" style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>About</Text>
                            <Text className="text-base leading-6" style={{ fontFamily: 'Outfit-Regular', color: isDark ? '#a1a1aa' : '#4b5563' }}>
                                {profileData.profile?.bio || 'No biography provided yet.'}
                            </Text>

                            {profileData.profile?.skills && profileData.profile.skills.length > 0 && (
                                <View className="mt-6">
                                    <Text className="text-lg mb-3" style={{ fontFamily: 'Outfit-Bold', color: theme.text }}>Skills</Text>
                                    <View className="flex-row flex-wrap gap-2">
                                        {profileData.profile.skills.map((skill: string) => (
                                            <View
                                                key={skill}
                                                className="px-4 py-2 rounded-full border"
                                                style={{
                                                    borderColor: isDark ? '#2f3336' : '#eff3f4',
                                                    backgroundColor: isDark ? '#16181c' : '#f9fafb'
                                                }}
                                            >
                                                <Text style={{ color: theme.text, fontFamily: 'Outfit-Medium', fontSize: wp('3.2%') }}>{skill}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </View>
                    ) : activeTab === 'Posts' ? (
                        <View className="gap-y-4">
                            {userPosts.length > 0 ? (
                                userPosts.map(post => (
                                    <FeedItem key={post.id} item={{ ...post, type: 'post' } as any} />
                                ))
                            ) : (
                                <View className="items-center mt-10">
                                    <Text className="text-zinc-500" style={{ fontFamily: 'Outfit-Medium' }}>No posts yet.</Text>
                                </View>
                            )}
                        </View>
                    ) : activeTab === 'Media' ? (
                        <View className="flex-row flex-wrap gap-2">
                            {userReels.length > 0 ? (
                                userReels.map(reel => (
                                    <TouchableOpacity
                                        key={reel._id}
                                        style={{ width: (wp('100%') - 50) / 2, height: wp('60%') }}
                                        className="rounded-2xl overflow-hidden bg-zinc-900"
                                    >
                                        <Image source={{ uri: reel.thumbnailUrl }} className="w-full h-full" resizeMode="cover" />
                                        <View className="absolute bottom-3 left-3 flex-row items-center">
                                            <Ionicons name="play" size={12} color="#fff" />
                                            <Text className="text-white text-[10px] ml-1 font-bold">{reel.views || 0}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <View className="items-center mt-10 w-full">
                                    <Text className="text-zinc-500" style={{ fontFamily: 'Outfit-Medium' }}>No media found.</Text>
                                </View>
                            )}
                        </View>
                    ) : activeTab === 'Jobs' ? (
                        <View className="gap-y-4">
                            {userJobs.length > 0 ? (
                                userJobs.map(job => (
                                    <JobCard key={job._id} job={job} />
                                ))
                            ) : (
                                <View className="items-center mt-10 w-full">
                                    <Text className="text-zinc-500" style={{ fontFamily: 'Outfit-Medium' }}>No jobs posted.</Text>
                                </View>
                            )}
                        </View>
                    ) : (
                        <View className="items-center mt-10">
                            <Text className="text-zinc-500" style={{ fontFamily: 'Outfit-Medium' }}>No {activeTab.toLowerCase()} to display yet.</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Image Viewer Modal */}
            <Modal
                visible={viewerVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setViewerVisible(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{ position: 'absolute', top: hp('6%'), right: wp('5%'), zIndex: 100, padding: 10 }}
                        onPress={() => setViewerVisible(false)}
                    >
                        <Ionicons name="close" size={32} color="white" />
                    </TouchableOpacity>
                    {viewerImage ? (
                        <Image
                            source={{ uri: viewerImage }}
                            style={{ width: wp('100%'), height: hp('70%') }}
                            resizeMode="contain"
                        />
                    ) : null}
                </View>
            </Modal>
        </View>
    );
}