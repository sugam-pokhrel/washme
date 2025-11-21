import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getAuthInstance, getFirestoreInstance } from '../firebase/config';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

export default function MyListings() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let unsub = () => {};
    try {
      const auth = getAuthInstance();
      const db = getFirestoreInstance();
      const uid = auth.currentUser && auth.currentUser.uid;
      if (!uid) return;
      const q = query(collection(db, 'laundries'), where('ownerId', '==', uid), orderBy('createdAt', 'desc'));
      unsub = onSnapshot(q, (snap) => {
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
    } catch (err) {
      console.warn('MyListings subscribe failed', err);
    }
    return () => unsub && unsub();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Listings</Text>
      <FlatList
        data={items}
        ListEmptyComponent={() => <Text style={{ color: '#777' }}>You have no listings yet</Text>}
        keyExtractor={i => i.id}
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
