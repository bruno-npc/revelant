import { Text, View } from 'react-native';

export default function PostsUser() {
  return (
    <View style={styles.container}>
      <View>
        <Text>PostsUser</Text>
      </View>
    </View>

  );
}
const styles = StyleSheet.create({
  container:{
    flex: 1,
    padding: '20px',
    backgroundColor: '#f0f0f0'
  }
});
