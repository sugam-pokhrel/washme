import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { subscribeToLaundries } from '../firebase/config';

export default function Laundries() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let unsub;
    try {
      unsub = subscribeToLaundries((data) => {
        setItems(data);
      });
    } catch (err) {
      console.warn('Laundries: subscribe failed', err);
    }

    return () => unsub && unsub();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Laundries Near Me</Text>
      <FlatList
        data={items}
        ListEmptyComponent={() => <Text style={{ color: '#777' }}>No laundries yet</Text>}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.addr}>{item.address}</Text>
            <Text style={styles.price}>{item.price}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10, elevation: 1 },
  name: { fontSize: 16, fontWeight: '600' },
  addr: { color: '#555' },
  price: { marginTop: 6, color: '#333', fontWeight: '600' },
});
