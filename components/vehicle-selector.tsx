import { Text, View, StyleSheet } from 'react-native';

export default function VehicleSelector() {
  return (
    <View style={styles.container}>
      <Text>Vehicle Selector Component</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    width: '80%',
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 10,
    zIndex: 10,
    borderRadius: 8,
    elevation: 10,
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
  },
});
