import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Colors } from '@/app/constants/Colors';
import { useColorScheme } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    const steps = ['Identity', 'Skills', 'Uploads'];

    return (
        <View style={styles.container}>
            <View style={styles.stepsRow}>
                {steps.map((step, index) => {
                    const isActive = index <= currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <View key={step} style={styles.stepWrapper}>
                            <View style={styles.stepItem}>
                                <MotiView
                                    animate={{
                                        backgroundColor: isActive ? theme.brand : (isDark ? '#27272a' : '#e4e4e7'),
                                        scale: isCurrent ? 1.1 : 1,
                                    }}
                                    transition={{ type: 'timing', duration: 300 }}
                                    style={styles.dot}
                                />
                                <Text style={[
                                    styles.stepLabel,
                                    {
                                        color: isCurrent ? theme.text : '#71717a',
                                        fontFamily: isCurrent ? 'Outfit-Bold' : 'Outfit-Medium'
                                    }
                                ]}>
                                    {step}
                                </Text>
                            </View>
                            {index < totalSteps - 1 && (
                                <View style={[
                                    styles.line,
                                    { backgroundColor: index < currentStep ? theme.brand : (isDark ? '#27272a' : '#e4e4e7') }
                                ]} />
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    stepsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    stepWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    stepItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginBottom: 6,
    },
    stepLabel: {
        fontSize: wp('3.2%'),
    },
    line: {
        flex: 1,
        height: 2,
        marginHorizontal: 10,
        marginBottom: 20, // Align with dot center
    },
});

export default StepIndicator;
