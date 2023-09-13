import { StyleSheet, Text, View } from 'react-native';
import {Container, ButtonPost} from './styles'
import { useNavigation } from '@react-navigation/native';

import Feather from 'react-native-vector-icons/Feather'

export default function Home() {

  const navigation = useNavigation();

  return (
    <Container>
      <ButtonPost onPress={() => navigation.navigate('NewPost')}>
        <Feather
          name='edit-2'
          color='#9372F1'
          size={25}
        />
      </ButtonPost>
    </Container>
  );
}
