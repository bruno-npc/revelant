import { View, Text, StyleSheet,  Image, ActivityIndicator } from 'react-native'
import React, {useState, useContext} from 'react'
import { Container, ImageContainer, TopImage, TopBar, BackButton, Title, Subtitle, Input, Button, ButtonText, CheckBoxContainer, CheckBox, CheckBoxText, TextLink, TextLinkText } from './styles'
import {LinearGradient} from "expo-linear-gradient"

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
      <>
      <ImageContainer>
        <TopImage source={require('../../assets/img/login_background.jpg')}/>
        <LinearGradient
        style={styles.gradient}
        colors={['transparent', 'rgba(0,0,0,0.70)', 'rgba(0,0,0,0.95)']}
      />
      <Title style={{position:'absolute', 
                      color:'#fff',
                      bottom:14,
                      left:14,
                      zIndex:99,
                      left: '35%',}}>
      Bem vindo!</Title>
      </ImageContainer>
      <Container>
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
              <Text style={{color:'#fff'}}>Acessar</Text>
            )
          }
        </Button>

        <Button onPress={ () => toggleLogin() }>
          <Text style={{color:'#fff'}}>Criar uma conta.</Text>
        </Button>
      </Container>
      </>
    );
  }
  return (

    <>
    <ImageContainer>
      <TopImage source={require('../../assets/img/login_background.jpg')}/>
      <LinearGradient
      style={styles.gradient}
      colors={['transparent', 'rgba(0,0,0,0.70)', 'rgba(0,0,0,0.95)']}
    />
    <Title style={{position:'absolute', 
                    color:'#fff',
                    bottom:14,
                    left:14,
                    zIndex:99,
                    left: '23%',}}>
    Página de cadastro</Title>
    </ImageContainer>

    <Container>
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
              <Text style={{color:'#fff'}}>Cadastrar</Text>
            )
        }
      </Button>

      <Button onPress={ () => toggleLogin() }>
        <Text style={{color:'#fff'}}>Já tenho uma conta.</Text>
      </Button>
    </Container>
    </>
  )
}

const styles = StyleSheet.create({
  gradient:{
    flex: 1,
    position:'absolute',
    left:0,
    right:0,
    bottom:0,
    height:'55%',
    width:'100%',
    zIndex:1,
    backgroundColor:'transparent',
    justifyContent: 'center',
    alignItems:'center'
  }
});