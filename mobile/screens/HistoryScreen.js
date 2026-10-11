import { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { getReadings } from '../utils/api'
import { categorise, CATEGORY_LABELS, CATEGORY_COLORS } from '../utils/categories'

export default function HistoryScreen({ onLogNew }) {
  const [readings, setReadings] = useState([])

  useEffect(() => {
    getReadings().then(setReadings)
  }, [])

  function formatDate(iso) {
    return new Date(iso).toLocaleString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <TouchableOpacity style={styles.addBtn} onPress={onLogNew}>
          <Text style={styles.addBtnText}>+ Log</Text>
        </TouchableOpacity>
      </View>

      {readings.length === 0 ? (
        <Text style={styles.empty}>No readings yet. Log one above.</Text>
      ) : (
        <FlatList
          data={readings}
          keyExtractor={r => String(r.id)}
          renderItem={({ item }) => {
            const cat   = categorise(item.systolic, item.diastolic)
            const color = CATEGORY_COLORS[cat]
            const label = CATEGORY_LABELS[cat]
            return (
              <View
                style={styles.readingItem}
                testID="reading-item"
                accessibilityLabel={`category-${cat}`}
              >
                <View style={styles.readingLeft}>
                  <View style={[styles.dot, { backgroundColor: color }]} />
                  <View>
                    <Text style={styles.values} testID="reading-values">
                      {item.systolic}/{item.diastolic} mmHg · {item.pulse} bpm
                    </Text>
                    <Text style={styles.meta}>{formatDate(item.timestamp)}</Text>
                  </View>
                </View>
                <View style={[styles.badge, { backgroundColor: color + '22' }]}>
                  <Text style={[styles.badgeText, { color }]}>{label}</Text>
                </View>
              </View>
            )
          }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#f6f9fc', padding: 24 },
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title:        { fontSize: 22, fontWeight: '700', color: '#1a1f36' },
  addBtn:       { backgroundColor: '#635bff', borderRadius: 6, paddingVertical: 8, paddingHorizontal: 14 },
  addBtnText:   { color: '#fff', fontWeight: '600', fontSize: 13 },
  empty:        { textAlign: 'center', color: '#6b7c93', marginTop: 48 },
  readingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e3e8ee',
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
  },
  readingLeft:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot:          { width: 10, height: 10, borderRadius: 5 },
  values:       { fontSize: 15, fontWeight: '600', color: '#1a1f36' },
  meta:         { fontSize: 12, color: '#6b7c93', marginTop: 2 },
  badge:        { borderRadius: 20, paddingVertical: 3, paddingHorizontal: 8 },
  badgeText:    { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
})
