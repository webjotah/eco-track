import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0a1d19ff',
      }}
    >
      <Text style={{ color: '#e4e4e4ff', fontSize: 28, fontWeight: 'bold' }}>
        {' '}
        Hello EcoTrack!
      </Text>
    </View>
  );
}
