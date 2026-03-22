import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    useColorScheme,
    Image
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/app/constants/Colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { user as userApi, User } from '@/app/data/api';

export default function FollowListScreen() {
    const { id, type } = useLocalSearchParams(); // type: 'followers' | 'following'
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchList = async () => {
            try {
                setLoading(true);
                if (type === 'followers') {
                    const res = await userApi.getFollowers(id as string);
                    if (res.success) {
                        setUsers(res.followers);
                    } else {
                        setError('Failed to load list');
                    }
                } else {
                    const res = await userApi.getFollowing(id as string);
                    if (res.success) {
                        setUsers(res.following);
                    } else {
                        setError('Failed to load list');
                    }
                }
            } catch (err: any) {
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchList();
    }, [id, type]);

    const renderUserItem = ({ item }: { item: any }) => {
        const name = item.profile?.fullName || item.recruiterProfile?.companyName || item.username || 'User';
        const headline = item.profile?.headline || item.recruiterProfile?.industry || 'Professional';
        const avatar = item.avatar || `https://ui-avatars.com/api/?name=${name.replace(/\s+/g, '+')}`;

        return (
            <TouchableOpacity
                onPress={() => router.push(`/screens/profile/${item._id}`)}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: wp('4%'),
                    borderBottomWidth: 1,
                    borderBottomColor: isDark ? '#2c2c2e' : '#f4f4f5'
                }}
            >
                <Image source={{ uri: avatar }} style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#27272a' }} />
                <View style={{ marginLeft: wp('4%'), flex: 1 }}>
                    <Text style={{ color: theme.text, fontFamily: 'Outfit-Bold', fontSize: wp('4%') }}>{name}</Text>
                    <Text style={{ color: '#71717a', fontFamily: 'Outfit-Regular', fontSize: wp('3.5%') }} numberOfLines={1}>{headline}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#71717a" />
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: wp('4%'),
                height: hp('7%'),
                borderBottomWidth: 1,
                borderBottomColor: isDark ? '#2c2c2e' : '#f4f4f5'
            }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={{
                    marginLeft: wp('4%'),
                    fontSize: wp('4.5%'),
                    fontFamily: 'Outfit-Bold',
                    color: theme.text,
                    textTransform: 'capitalize'
                }}>{type}</Text>
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={theme.brand} />
                </View>
            ) : error ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <Text style={{ color: theme.text, fontFamily: 'Outfit-Medium', textAlign: 'center' }}>{error}</Text>
                </View>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item._id}
                    renderItem={renderUserItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={
                        <View style={{ marginTop: 50, alignItems: 'center' }}>
                            <Text style={{ color: '#71717a', fontFamily: 'Outfit-Medium' }}>No users found.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}
