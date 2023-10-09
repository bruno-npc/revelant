import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {Container, ButtonPost} from './styles'
import { useNavigation } from '@react-navigation/native';
import { MeusPosts } from '../../components/myPosts';
import Feather from 'react-native-vector-icons/Feather'

export default function Home() {

  const navigation = useNavigation();

  return (
    <Container>
      <ScrollView>
        <MeusPosts
          imagemSource={require('../../assets/img/login_background.jpg')}
          descricao="Esta é uma descrição de exemplo para a postagem 1."
        />
        <MeusPosts
          imagemSource={require('../../assets/img/login_background.jpg')}
          descricao="Esta é uma descrição de exemplo para a postagem 2."
        />
        <MeusPosts
          imagemSource={require('../../assets/img/biblia.jpg')}
          descricao="Esta é uma descrição de exemplo para a postagem 2."
        />
        <MeusPosts
          imagemSource={require('../../assets/img/login_background.jpg')}
          descricao="Esta é uma descrição de exemplo para a postagem 2."
        />
        <MeusPosts
          imagemSource={require('../../assets/img/biblia.jpg')}
          descricao="Esta é uma descrição de exemplo para a postagem 2."
        />
      </ScrollView>
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
