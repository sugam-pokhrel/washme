import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { registerLaundry } from '../firebase/config';

export default function RentLaundry() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !address || !price) return Alert.alert('Validation', 'Please fill all fields');
    setLoading(true);
    try {
      const res = await registerLaundry({ name, address, price });
      setLoading(false);
      Alert.alert('Success', 'Your laundry listing has been created (id=' + res.id + ')');
      setName('');
      setAddress('');
      setPrice('');
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', err.message || 'Failed to register');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rent Out My Laundry</Text>
      <TextInput placeholder="Machine name" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Address" style={styles.input} value={address} onChangeText={setAddress} />
      <TextInput placeholder="Price per load" style={styles.input} value={price} onChangeText={setPrice} />
      <Button title={loading ? 'Submitting...' : 'Submit'} onPress={handleSubmit} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, marginBottom: 10 },
});
