import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/app/constants/Colors';
import { useColorScheme } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface HomeHeaderProps {
    onFilterPress?: () => void;
    onSearch?: (query: string) => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ onFilterPress, onSearch }) => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <View style={styles.container}>
            {!isSearching ? (
                <View className="flex-row items-center justify-between px-4 h-14">
                    {/* Brand Logo & Name Section */}
                    <View className="flex-row items-center">
                        <Image
                            source={require('@/assets/images/logo.png')}
                            style={{ width: wp('5%'), height: wp('5%') }}
                            resizeMode="contain"
                            className='mr-1'
                        />
                        <Text
                            className="text-xl tracking-tighter"
                            style={{ fontFamily: 'Outfit-Bold', color: theme.text }}
                        >
                            dispatch.io
                        </Text>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row items-center gap-x-5">
                        <TouchableOpacity onPress={() => setIsSearching(true)}>
                            <Ionicons name="search" size={22} color={theme.text} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onFilterPress}>
                            <Ionicons name="options-outline" size={22} color={theme.text} />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View className="flex-row items-center px-4 h-14">
                    <TouchableOpacity
                        onPress={() => {
                            setIsSearching(false);
                            setSearchQuery('');
                            onSearch?.('');
                        }}
                        className="mr-3"
                    >
                        <Ionicons name="arrow-back" size={22} color={theme.text} />
                    </TouchableOpacity>

                    <View className="flex-1 bg-zinc-500/10 rounded-full px-4 h-9 flex-row items-center">
                        <Ionicons name="search" size={16} color="#71717a" className="mr-2" />
                        <TextInput
                            autoFocus
                            placeholder="Search jobs, people..."
                            placeholderTextColor="#71717a"
                            value={searchQuery}
                            onChangeText={(text) => {
                                setSearchQuery(text);
                                onSearch?.(text);
                            }}
                            className="flex-1 h-full text-[15px]"
                            style={{ color: theme.text, fontFamily: 'Outfit-Regular' }}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => {
                                setSearchQuery('');
                                onSearch?.('');
                            }}>
                                <Ionicons name="close-circle" size={16} color="#71717a" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // Border bottom removed for a cleaner flow into the content/tabs
    }
});

export default HomeHeader;