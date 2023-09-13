import { View, Text, Image, ActivityIndicator } from 'react-native'
import React, {useState, useContext} from 'react'
import { Container, TopBar, BackButton, Title, Subtitle, Input, Button, ButtonText, CheckBoxContainer, CheckBox, CheckBoxText, TextLink, TextLinkText } from './styles'

import { AuthContext } from '../../contexts/auth';

export default function Login() {  
  const { signIn, signUp, loadingAuth } = useContext(AuthContext);

  const [login, setLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function toggleLogin(){
    setLogin(!login);
    setName('');
    setEmail('');
    setPassword('');
  }

  function handleLogin(){
    if(email === '' || password === ''){
      console.log('Preencha todos os campos!');
      return;
    }

    signIn(email, password);
  }

  function handleSignUp(){
    if(name === '' || email === '' || password === ''){
      console.log('Preencha todos os campos!');
      return;  
    }

    //Cadastrando usuario!
    signUp(email, password, name);
  }

  if(login){
    return (
      <Container>
          <Title style={{marginTop: '70%'}}>Bem vindo</Title>
          <Subtitle>Realizar login:</Subtitle>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          <Input
            placeholder="Senha"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <CheckBoxContainer>
            <CheckBox />
            <CheckBoxText>Lembrar acesso</CheckBoxText>
          </CheckBoxContainer>

          <Button onPress={handleLogin}>
          {
            loadingAuth ? (
              <ActivityIndicator size={20} color="#FFF" />
            ) : (
              <Text>Acessar</Text>
            )
          }
        </Button>

        <Button onPress={ () => toggleLogin() }>
          <Text>Criar uma conta.</Text>
        </Button>
      </Container>
    );
  }
  return (
    <Container>
      <Text>Página cadastro</Text>

        <Title style={{marginTop: '70%'}}>Cadastro...</Title>

        <Input
          placeholder="Nome"
          value={name}
          onChangeText={(text) => setName(text)}
        />

        <Input
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input placeholder="Senha" 
               secureTextEntry={true} 
               value={password}
               onChangeText={(text) => setPassword(text)}
        />
      <Button onPress={handleSignUp}>
        {
            loadingAuth ? (
              <ActivityIndicator size={20} color="#FFF" />
            ) : (
              <Text>Cadastrar</Text>
            )
        }
      </Button>

      <Button onPress={ () => toggleLogin() }>
        <Text>Já tenho uma conta.</Text>
      </Button>
    </Container>
  )
}