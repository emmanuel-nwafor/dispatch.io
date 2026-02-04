import React from 'react';
import { Text, View } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ToastConfig } from 'react-native-toast-message';

export const toastConfig: ToastConfig = {
    success: ({ text1, text2 }) => (
        <View style={{
            width: wp('85%'),
            borderRadius: 12,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: 'rgba(223, 255, 0, 0.2)',
            backgroundColor: '#064e3b',
        }}>
            <View style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                {/* Brand Accent Line */}
                <View style={{
                    width: 4,
                    height: '100%',
                    backgroundColor: '#DFFF00',
                    borderRadius: 2,
                    marginRight: 12
                }} />
                <View style={{ flex: 1 }}>
                    <Text style={{
                        color: '#DFFF00',
                        fontFamily: 'Outfit-Bold',
                        fontSize: 14
                    }}>{text1}</Text>
                    {text2 && <Text style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontFamily: 'Outfit-Medium',
                        fontSize: 12
                    }}>{text2}</Text>}
                </View>
            </View>
        </View>
    ),

    error: ({ text1, text2 }) => (
        <View style={{
            width: wp('85%'),
            borderRadius: 16,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: 'rgba(239, 68, 68, 0.2)',
            backgroundColor: '#450a0a',
        }}>
            <View style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <View style={{
                    width: 4,
                    height: '100%',
                    backgroundColor: '#ef4444',
                    borderRadius: 2,
                    marginRight: 12
                }} />
                <View style={{ flex: 1 }}>
                    <Text style={{
                        color: '#FFFFFF',
                        fontFamily: 'Outfit-Bold',
                        fontSize: 14
                    }}>{text1}</Text>
                    {text2 && <Text style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontFamily: 'Outfit-Medium',
                        fontSize: 12
                    }}>{text2}</Text>}
                </View>
            </View>
        </View>
    ),

    info: ({ text1, text2 }) => (
        <View style={{
            width: wp('85%'),
            borderRadius: 12,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            backgroundColor: '#18181b',
        }}>
            <View style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <View style={{ flex: 1 }}>
                    <Text style={{
                        color: '#FFFFFF',
                        fontFamily: 'Outfit-Bold',
                        fontSize: 14
                    }}>{text1}</Text>
                    {text2 && <Text style={{
                        color: '#a1a1aa',
                        fontFamily: 'Outfit-Medium',
                        fontSize: 12
                    }}>{text2}</Text>}
                </View>
            </View>
        </View>
    )
};