import { Text, TextInput, StyleSheet, ActivityIndicator, View, Image, Alert, TouchableOpacity, ScrollView } from 'react-native'
import React, {useState, useContext} from 'react'
import {LinearGradient} from "expo-linear-gradient"
import { AuthContext } from '../../contexts/auth';
import * as DocumentPicker from 'expo-document-picker';
import Feather from 'react-native-vector-icons/Feather'

import { useNavigation } from '@react-navigation/native';

export default function Login() {  
  const { signIn, signUp, loadingAuth, signed } = useContext(AuthContext);

  const [login, setLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [estado, setEstado] = useState('');
  const [igreja, setIgreja] = useState('');
  const [religiao, setReligiao] = useState('');
  const [documentoRecomendacaoPastoral, setDocumentoRecomendacaoPastoral] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  const navigation = useNavigation();

  function toggleLogin(){
    setLogin(!login);
    setName('');
    setPassword('');
  }

  function handleLogin(){
    if(email === '' || password === ''){
      Alert.alert('Aviso', 'Preencha todos os campos!');
      return;
    }signIn(email, password);
    if(signed){
      navigation.navigate('AppRoutes')
    }
  }

  function handleSignUp(){
    if(name === '' || email === '' || password === ''){
      Alert.alert('Aviso', 'Preencha todos os campos!');
      return;}
    signUp(email, password, name, estado, igreja, religiao, documentoRecomendacaoPastoral);
    toggleLogin();
  }

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      if (!result.cancelled) {
        const selectedFile = result;
        setSelectedFile(selectedFile.name);
      } else {
        console.log('Seleção de documento cancelada');
      }
    } catch (err) {
      console.log('Erro ao selecionar o documento:', err);
    }
  };

  if (login) {
    return (
      <>
        <View style={styles.imageContainer}>
          <Image source={require('../../assets/img/login_background.jpg')} style={styles.topImage} />
          <LinearGradient style={styles.gradient} colors={['transparent', 'rgba(0,0,0,0.70)', 'rgba(0,0,0,0.95)']}/>
          <TouchableOpacity style={styles.backButton} 
          onPress={() => navigation.goBack()}
          >
            <Feather name='arrow-left-circle' color={'white'} size={40} />
          </TouchableOpacity>
          <Text style={styles.titulo}>
            Bem vindo!
          </Text>
        </View>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
  
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            {
              loadingAuth ? (
                <ActivityIndicator size={20} color="#FFF" />
              ) : (
                <Text style={{ color: '#fff' }}>Acessar</Text>
              )
            }
          </TouchableOpacity>
  
          <TouchableOpacity style={styles.button} onPress={() => toggleLogin()}>
            <Text style={{ color: '#fff' }}>Criar uma conta.</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
  return (
  <>
    <View style={styles.imageContainer}>
      <Image source={require('../../assets/img/login_background.jpg')} style={styles.topImage} />
      <LinearGradient style={styles.gradient} colors={['transparent', 'rgba(0,0,0,0.70)', 'rgba(0,0,0,0.95)']} />
      <TouchableOpacity style={styles.backButton} 
      onPress={() => navigation.goBack()}
      >
            <Feather name='arrow-left-circle' color={'white'} size={40} />
      </TouchableOpacity>
      <Text style={styles.titulo}>
        Página de cadastro
      </Text>
    </View>

    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.scrollView}>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={(text) => setName(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={pickDocument} style={styles.pdf}>
          <Text style={{ color: 'white' }}>Selecionar Recomendação pastoral</Text>
        </TouchableOpacity>
        {selectedFile && (
          <View style={{ marginTop: 20 }}>
            <Text>Arquivo Selecionado:</Text>
            <Text>{selectedFile}</Text>
          </View>
        )}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Estado"
        value={estado}
        onChangeText={(text) => setEstado(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Igreja"
        value={igreja}
        onChangeText={(text) => setIgreja(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Religião"
        value={religiao}
        onChangeText={(text) => setReligiao(text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        {loadingAuth ? (
          <ActivityIndicator size={20} color="#FFF" />
        ) : (
          <Text style={{ color: '#fff' }}>Cadastrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => toggleLogin()}>
        <Text style={{ color: '#fff'}}>Já tenho uma conta.</Text>
      </TouchableOpacity>
      <View style={{ marginBottom: 50 }}/>
    </ScrollView>
  </>
  );
}

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  scrollView: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  pdf:{
    width: '100%',
    padding: 20, 
    backgroundColor: '#9372F1', 
    borderRadius: 10,
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    paddingTop: 25,
    zIndex: 1
  },
  titulo: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 99,
  },
  imageContainer: {
    width: '100%',
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  topBar: {
    height: 60,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
    position: 'absolute',
  },
  topImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#9372F1',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 3,
    marginRight: 10,
  },
  checkBoxText: {
    fontSize: 14,
  },
  textLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  textLinkText: {
    fontSize: 14,
    color: '#9372F1',
  },
  gradient: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '55%',
    width: '100%',
    zIndex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  }
});