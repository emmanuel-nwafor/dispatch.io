import { Colors } from '@/app/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import React, { useState, useEffect } from 'react';
import {
    Modal,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
    Pressable,
    StyleSheet,
} from 'react-native';
import { Easing } from 'react-native-reanimated';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

interface JobFilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
}

const categories = ['All', 'Design', 'Development', 'Product', 'Marketing', 'Sales', 'Support'];
const jobTypes = ['Full-time', 'Part-time', 'Freelance', 'Remote', 'Internship'];
const salaryTiers = [
    { label: '$0 - $50k', value: '0-50' },
    { label: '$50k - $100k', value: '50-100' },
    { label: '$100k - $150k', value: '100-150' },
    { label: '$150k+', value: '150+' },
];

export default function JobFilterModal({ visible, onClose, onApply }: JobFilterModalProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const isDark = colorScheme === 'dark';

    // Internal state to control the AnimatePresence separately from the Modal visibility
    const [isInternalVisible, setIsInternalVisible] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
    const [selectedSalary, setSelectedSalary] = useState('');

    // Sync internal visibility with prop
    useEffect(() => {
        if (visible) {
            setIsInternalVisible(true);
        }
    }, [visible]);

    const handleDismiss = () => {
        setIsInternalVisible(false);
        // Wait for the exit animation (400ms) before calling the parent onClose
        setTimeout(() => {
            onClose();
        }, 400);
    };

    const toggleJobType = (type: string) => {
        if (selectedJobTypes.includes(type)) {
            setSelectedJobTypes(selectedJobTypes.filter((t) => t !== type));
        } else {
            setSelectedJobTypes([...selectedJobTypes, type]);
        }
    };

    const handleClearAll = () => {
        setSelectedCategory('All');
        setSelectedJobTypes([]);
        setSelectedSalary('');
    };

    const handleApply = () => {
        onApply({
            category: selectedCategory,
            jobTypes: selectedJobTypes,
            salary: selectedSalary,
        });
        handleDismiss();
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={handleDismiss}
        >
            <View style={styles.container}>
                <AnimatePresence>
                    {isInternalVisible && (
                        <>
                            {/* Overlay */}
                            <MotiView
                                from={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    type: 'timing',
                                    duration: 300,
                                    easing: Easing.out(Easing.quad)
                                }}
                                style={[StyleSheet.absoluteFillObject, styles.overlay]}
                            >
                                <Pressable style={{ flex: 1 }} onPress={handleDismiss} />
                            </MotiView>

                            {/* Bottom Sheet */}
                            <MotiView
                                from={{ translateY: hp('100%') }}
                                animate={{ translateY: 0 }}
                                exit={{ translateY: hp('100%') }}
                                transition={{
                                    type: 'timing',
                                    duration: 400,
                                    easing: Easing.bezier(0.33, 1, 0.68, 1), // Smooth slide out
                                }}
                                style={[
                                    styles.sheet,
                                    {
                                        backgroundColor: theme.background,
                                        paddingBottom: Platform.OS === 'ios' ? hp('4%') : hp('2%'),
                                    }
                                ]}
                            >
                                <View style={styles.handleContainer}>
                                    <View style={[
                                        styles.handle,
                                        { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)' }
                                    ]} />
                                </View>

                                <View style={styles.header}>
                                    <Text style={[styles.headerTitle, { color: theme.text }]}>
                                        Search Filter
                                    </Text>
                                    <TouchableOpacity
                                        onPress={handleDismiss}
                                        activeOpacity={0.7}
                                        style={[
                                            styles.closeButton,
                                            { backgroundColor: isDark ? '#1e1e21' : '#f4f4f5' }
                                        ]}
                                    >
                                        <Ionicons name="close" size={wp('6%')} color={theme.text} />
                                    </TouchableOpacity>
                                </View>

                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={styles.scrollContent}
                                    bounces={false}
                                >
                                    {/* Category Section */}
                                    <View style={styles.section}>
                                        <Text style={styles.sectionLabel}>Category</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                                            {categories.map((cat) => (
                                                <TouchableOpacity
                                                    key={cat}
                                                    onPress={() => setSelectedCategory(cat)}
                                                    style={[
                                                        styles.chip,
                                                        {
                                                            backgroundColor: selectedCategory === cat ? theme.brand : 'transparent',
                                                            borderColor: selectedCategory === cat ? theme.brand : (isDark ? '#3f3f46' : '#e4e4e7'),
                                                        }
                                                    ]}
                                                >
                                                    <Text style={[
                                                        styles.chipText,
                                                        { color: selectedCategory === cat ? '#000' : theme.text }
                                                    ]}>
                                                        {cat}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>

                                    {/* Job Type Section */}
                                    <View style={styles.section}>
                                        <Text style={styles.sectionLabel}>Job Type</Text>
                                        <View style={styles.grid}>
                                            {jobTypes.map((type) => {
                                                const isSelected = selectedJobTypes.includes(type);
                                                return (
                                                    <TouchableOpacity
                                                        key={type}
                                                        onPress={() => toggleJobType(type)}
                                                        style={[
                                                            styles.chip,
                                                            {
                                                                backgroundColor: isSelected ? theme.brand : 'transparent',
                                                                borderColor: isSelected ? theme.brand : (isDark ? '#3f3f46' : '#e4e4e7'),
                                                            }
                                                        ]}
                                                    >
                                                        <Text style={[
                                                            styles.chipText,
                                                            { color: isSelected ? '#000' : theme.text }
                                                        ]}>
                                                            {type}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    </View>

                                    {/* Salary Section */}
                                    <View style={styles.section}>
                                        <Text style={styles.sectionLabel}>Salary Range</Text>
                                        <View style={styles.grid}>
                                            {salaryTiers.map((tier) => (
                                                <TouchableOpacity
                                                    key={tier.value}
                                                    onPress={() => setSelectedSalary(tier.value)}
                                                    style={[
                                                        styles.chip,
                                                        {
                                                            backgroundColor: selectedSalary === tier.value ? theme.brand : 'transparent',
                                                            borderColor: selectedSalary === tier.value ? theme.brand : (isDark ? '#3f3f46' : '#e4e4e7'),
                                                        }
                                                    ]}
                                                >
                                                    <Text style={[
                                                        styles.chipText,
                                                        { color: selectedSalary === tier.value ? '#000' : theme.text }
                                                    ]}>
                                                        {tier.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                </ScrollView>

                                <View style={[
                                    styles.footer,
                                    { borderTopColor: isDark ? '#27272a' : '#f4f4f5' }
                                ]}>
                                    <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
                                        <Text style={styles.clearButtonText}>Clear All</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleApply}
                                        style={[styles.applyButton, { backgroundColor: theme.brand }]}
                                    >
                                        <Text style={styles.applyButtonText}>Apply Filter</Text>
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
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    sheet: {
        borderTopLeftRadius: wp('10%'),
        borderTopRightRadius: wp('10%'),
        maxHeight: hp('85%'),
        width: '100%',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -12 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
            },
            android: {
                elevation: 24,
            },
        }),
    },
    handleContainer: {
        alignItems: 'center',
        paddingVertical: hp('2%'),
    },
    handle: {
        width: wp('12%'),
        height: 5,
        borderRadius: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp('8%'),
        marginBottom: hp('3%'),
    },
    headerTitle: {
        fontSize: wp('6%'),
        fontFamily: 'Outfit-Bold',
    },
    closeButton: {
        width: wp('10%'),
        height: wp('10%'),
        borderRadius: wp('5%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        paddingHorizontal: wp('8%'),
        paddingBottom: hp('2%'),
    },
    section: {
        marginBottom: hp('3.5%'),
    },
    sectionLabel: {
        fontSize: wp('3.2%'),
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        color: '#71717a',
        marginBottom: hp('1.5%'),
        fontFamily: 'Outfit-Bold',
    },
    horizontalScroll: {
        marginHorizontal: wp('-8%'),
        paddingHorizontal: wp('8%'),
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    chip: {
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('1.5%'),
        borderRadius: wp('4%'),
        borderWidth: 1,
        marginBottom: 4,
    },
    chipText: {
        fontFamily: 'Outfit-Medium',
        fontSize: wp('3.6%'),
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp('8%'),
        paddingVertical: hp('2.5%'),
        borderTopWidth: 1,
    },
    clearButton: {
        flex: 1,
    },
    clearButtonText: {
        textAlign: 'center',
        fontFamily: 'Outfit-Bold',
        color: '#71717a',
        fontSize: wp('4%'),
    },
    applyButton: {
        flex: 2,
        paddingVertical: hp('2%'),
        borderRadius: wp('6%'),
        marginLeft: wp('4%'),
    },
    applyButtonText: {
        textAlign: 'center',
        fontFamily: 'Outfit-Bold',
        color: '#000',
        fontSize: wp('4%'),
    },
});