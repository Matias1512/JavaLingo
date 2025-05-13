import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, Text } from 'react-native';

export default function LoginButton() {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Login'); // Redirige vers la page de Login
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{ marginLeft: 10 }}>
      <Text style={{ color: 'blue', fontWeight: 'bold' }}>Login</Text>
    </TouchableOpacity>
  );
}
