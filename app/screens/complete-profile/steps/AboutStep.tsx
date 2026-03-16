import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function AboutStep({ formData, setFormData, theme, inputStyle, onOpenLocation }: any) {
    return (
        <KeyboardAwareScrollView
            enableOnAndroid={true}
            extraScrollHeight={hp('5%')}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: hp('5%') }}
        >
            {/* Header Section */}
            <View style={{ marginBottom: hp('4%') }}>
                <Text style={{ color: theme.text, fontSize: wp('8%'), fontFamily: 'Outfit-Bold' }}>
                    Where & What?
                </Text>
                <Text style={{ color: '#8e8e93', fontSize: wp('4.2%'), fontFamily: 'Outfit-Medium', marginTop: 5 }}>
                    Help us tailor the best opportunities for your location.
                </Text>
            </View>

            {/* Industry Input */}
            <Text style={[styles.label, { color: theme.text }]}>Industry</Text>
            <View style={[inputStyle, styles.inputRow]}>
                <MaterialCommunityIcons name="briefcase-variant-outline" size={20} color={theme.brand} />
                <TextInput
                    style={[styles.textInput, { color: theme.text }]}
                    placeholder="e.g. Fintech, Design, Logistics"
                    placeholderTextColor="#52525b"
                    value={formData.industry}
                    onChangeText={(t) => setFormData({ ...formData, industry: t })}
                />
            </View>

            {/* Location Selector */}
            <Text style={[styles.label, { color: theme.text, marginTop: hp('3%') }]}>
                Current Location
            </Text>
            <TouchableOpacity
                onPress={onOpenLocation}
                activeOpacity={0.7}
                style={[inputStyle, styles.locationBtn]}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Feather name="map-pin" size={18} color={theme.brand} />
                    <Text style={{
                        color: formData.location.country ? theme.text : '#52525b',
                        fontFamily: 'Outfit-Medium',
                        marginLeft: 10,
                        fontSize: wp('4%')
                    }}>
                        {formData.location.country
                            ? `${formData.location.state ? `${formData.location.state}, ` : ''}${formData.location.country}`
                            : "Select your city/country"}
                    </Text>
                </View>
                <Feather name="chevron-down" size={18} color="#8e8e93" />
            </TouchableOpacity>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    label: {
        fontFamily: 'Outfit-Bold',
        marginBottom: 10,
        marginLeft: 5,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    textInput: {
        flex: 1,
        height: hp('7%'),
        marginLeft: 10,
        fontFamily: 'Outfit-Medium',
    },
    locationBtn: {
        height: hp('7.5%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
});