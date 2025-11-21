import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { signOut } from '../firebase/config';

export default function MyAccount({ navigation }) {
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out failed', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Account</Text>
      <Text style={styles.item}>Profile info placeholder</Text>
      <Button title="My Listings" onPress={() => navigation.navigate('MyListings')} />
      <View style={{ height: 12 }} />
      <Button title="Sign out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  item: { marginBottom: 8 },
});
