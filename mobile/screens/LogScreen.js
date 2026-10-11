import { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { createReading, getReadings } from '../utils/api'
import { categorise, CATEGORY_LABELS, CATEGORY_COLORS } from '../utils/categories'

export default function LogScreen() {
  const [systolic, setSystolic]   = useState('')
  const [diastolic, setDiastolic] = useState('')
  const [pulse, setPulse]         = useState('')
  const [status, setStatus]       = useState(null) // 'success' | 'error' | null
  const [readings, setReadings]   = useState([])

  // Load readings on mount
  useEffect(() => { loadReadings() }, [])

  async function loadReadings() {
    const data = await getReadings()
    setReadings(data)
  }

  async function handleSubmit() {
    if (!systolic || !diastolic || !pulse) {
      setStatus('error')
      return
    }

    await createReading(systolic, diastolic, pulse)

    setSystolic('')
    setDiastolic('')
    setPulse('')
    setStatus('success')

    // Refresh the list so the new reading appears immediately
    await loadReadings()
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>BP Monitor</Text>

      {/* ── Log form ── */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Log a Reading</Text>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Systolic</Text>
            <TextInput
              style={styles.input}
              testID="systolic"
              keyboardType="numeric"
              placeholder="120"
              value={systolic}
              onChangeText={setSystolic}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Diastolic</Text>
            <TextInput
              style={styles.input}
              testID="diastolic"
              keyboardType="numeric"
              placeholder="80"
              value={diastolic}
              onChangeText={setDiastolic}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Pulse</Text>
            <TextInput
              style={styles.input}
              testID="pulse"
              keyboardType="numeric"
              placeholder="70"
              value={pulse}
              onChangeText={setPulse}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleSubmit} testID="submit-btn">
          <Text style={styles.btnText}>Log Reading</Text>
        </TouchableOpacity>

        {status === 'success' && (
          <Text style={styles.success} testID="success-message">Reading saved successfully.</Text>
        )}
        {status === 'error' && (
          <Text style={styles.error} testID="error-message">Please fill in all fields.</Text>
        )}
      </View>

      {/* ── History list ── */}
      <Text style={styles.sectionTitle}>History</Text>

      {readings.length === 0 ? (
        <Text style={styles.empty}>No readings yet.</Text>
      ) : (
        readings.map(r => {
          const cat   = categorise(r.systolic, r.diastolic)
          const color = CATEGORY_COLORS[cat]
          const label = CATEGORY_LABELS[cat]
          return (
            <View
              key={r.id}
              style={styles.readingItem}
              testID="reading-item"
              accessibilityLabel={`category-${cat}`}
            >
              <View style={styles.readingLeft}>
                <View style={[styles.dot, { backgroundColor: color }]} />
                <View>
                  <Text style={styles.values} testID="reading-values">
                    {r.systolic}/{r.diastolic} mmHg · {r.pulse} bpm
                  </Text>
                  <Text style={styles.meta}>{formatDate(r.timestamp)}</Text>
                </View>
              </View>
              <View style={[styles.badge, { backgroundColor: color + '22' }]}>
                <Text style={[styles.badgeText, { color }]}>{label}</Text>
              </View>
            </View>
          )
        })
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container:    { padding: 24, backgroundColor: '#f6f9fc', flexGrow: 1 },
  title:        { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#1a1f36' },

  card:         { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#e3e8ee', padding: 20, marginBottom: 24 },
  cardTitle:    { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, color: '#6b7c93', marginBottom: 16 },

  row:          { flexDirection: 'row', gap: 12, marginBottom: 16 },
  field:        { flex: 1 },
  label:        { fontSize: 13, fontWeight: '500', color: '#3c4257', marginBottom: 6 },
  input:        { borderWidth: 1, borderColor: '#e3e8ee', borderRadius: 6, padding: 10, fontSize: 15, backgroundColor: '#fff' },

  btn:          { backgroundColor: '#635bff', borderRadius: 6, padding: 14, alignItems: 'center', marginBottom: 12 },
  btnText:      { color: '#fff', fontWeight: '600', fontSize: 14 },
  success:      { color: '#1a5c2a', backgroundColor: '#d4edda', padding: 10, borderRadius: 6, fontSize: 13 },
  error:        { color: '#9b1c1c', backgroundColor: '#fdecea', padding: 10, borderRadius: 6, fontSize: 13 },

  sectionTitle: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, color: '#6b7c93', marginBottom: 12 },
  empty:        { textAlign: 'center', color: '#6b7c93', marginTop: 24, fontSize: 14 },

  readingItem:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e3e8ee', borderRadius: 8, padding: 14, marginBottom: 8 },
  readingLeft:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot:          { width: 10, height: 10, borderRadius: 5 },
  values:       { fontSize: 15, fontWeight: '600', color: '#1a1f36' },
  meta:         { fontSize: 12, color: '#6b7c93', marginTop: 2 },
  badge:        { borderRadius: 20, paddingVertical: 3, paddingHorizontal: 8 },
  badgeText:    { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
})
