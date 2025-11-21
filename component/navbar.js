import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions,
    Platform,
    TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const NAV_ITEMS = ['Home', 'Services', 'Orders', 'Profile'];

/**
 * Props:
 * - onMenuPress: function(label?) called when menu or dropdown item pressed
 * - showSearch: boolean to show search bar under header
 * - placeholder: search input placeholder
 */
function Navbar({ onMenuPress, showSearch = false, placeholder = 'Search city or zip code' }) {
    const { width } = useWindowDimensions();
    const isLarge = width >= 600; // breakpoint for tablet / large phones
    const [menuOpen, setMenuOpen] = useState(false);
    const [query, setQuery] = useState('');

    const handleMenuToggle = () => {
        if (typeof onMenuPress === 'function') {
            onMenuPress();
        } else {
            setMenuOpen((v) => !v);
        }
    };

    const handleSelect = (label) => {
        setMenuOpen(false);
        if (typeof onMenuPress === 'function') onMenuPress(label);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={styles.header.backgroundColor} />

            <View style={styles.header}>
                <TouchableOpacity onPress={handleMenuToggle} accessibilityLabel="Open menu" style={styles.iconTouch}>
                    <Feather name="menu" size={22} color="#222" />
                </TouchableOpacity>

                <View style={styles.titleWrap}>
                    <Text style={styles.title}>Wash Connect</Text>
                </View>

                <TouchableOpacity accessibilityLabel="Profile" style={styles.iconTouch} onPress={() => handleSelect('Profile')}>
                    <Feather name="user" size={20} color="#222" />
                </TouchableOpacity>
            </View>

            {/* Optional search bar like the design */}
            {showSearch && (
                <View style={styles.searchWrap}>
                    <Feather name="search" size={18} color="#999" style={{ marginLeft: 10 }} />
                    <TextInput
                        placeholder={placeholder}
                        value={query}
                        onChangeText={setQuery}
                        style={styles.searchInput}
                        returnKeyType="search"
                        onSubmitEditing={() => {
                            if (typeof onMenuPress === 'function') onMenuPress({ type: 'search', query });
                        }}
                    />
                </View>
            )}

            {/* Small-screen dropdown menu */}
            {!isLarge && menuOpen && (
                <View style={styles.dropdown}>
                    {NAV_ITEMS.map((label) => (
                        <TouchableOpacity key={label} onPress={() => handleSelect(label)} style={styles.dropdownItem}>
                            <Text style={styles.dropdownText}>{label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#fff',
        paddingHorizontal: 14,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderBottomColor: '#e6e6e6',
        ...(Platform.OS === 'android' ? { elevation: 2 } : { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }),
    },
    iconTouch: {
        padding: 6,
    },
    titleWrap: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        color: '#111',
        fontSize: 18,
        fontWeight: '600',
    },
    searchWrap: {
        margin: 12,
        marginTop: 10,
        backgroundColor: '#f7f7f8',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    searchInput: {
        marginLeft: 8,
        paddingVertical: 6,
        paddingHorizontal: 10,
        flex: 1,
        fontSize: 15,
        color: '#333',
    },
    dropdown: {
        backgroundColor: '#fff',
        paddingVertical: 6,
        marginHorizontal: 14,
        borderRadius: 8,
        marginTop: 8,
        borderWidth: 0.5,
        borderColor: '#e6e6e6',
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    dropdownText: {
        color: '#222',
        fontSize: 16,
    },
});

export default Navbar;