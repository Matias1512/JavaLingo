import { TouchableOpacity, Text } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig'; // adapte ce chemin si besoin

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Utilisateur déconnecté');
    } catch (error) {
      console.error("Erreur déconnexion :", error);
    }
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 10 }}>
      <Text style={{ color: 'red', fontWeight: 'bold' }}>Logout</Text>
    </TouchableOpacity>
  );
}
