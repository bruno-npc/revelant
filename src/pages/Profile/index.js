import { View, Button } from 'react-native';
import { useContext } from 'react';
import {Container} from './styles'

import { AuthContext } from '../../contexts/auth';

export default function Profile() {
  const { signOut } = useContext(AuthContext);

  return (
    <Container>
      <View>
        <Button title='Sair' onPress={() => signOut()} />
      </View>
    </Container>
  );
}