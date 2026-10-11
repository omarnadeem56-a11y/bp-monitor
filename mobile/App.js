import { SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import LogScreen from './screens/LogScreen'

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <LogScreen />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f6f9fc' },
})
