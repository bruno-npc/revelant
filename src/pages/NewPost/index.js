import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, Image } from 'react-native';
import {getDatabase, ref, set } from 'firebase/database';
import storage from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { AuthContext } from '../../contexts/auth';

export default function NewPost() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagens, setImagens] = useState([]);
  const [imagemUrls, setImagemUrls] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      if (Constants.platform?.ios) {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Erro', 'Desculpe, precisamos das permissões da galeria para escolher imagens.');
        }
      }
    })();
  }, []);

  const escolherImagem = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.cancelled) {
      const novaImagem = result.uri;
      setImagens([...imagens, novaImagem]);
    }
  };

  const testarDatabase = async () => {
    try {
      const database = getDatabase();
      const userId = 'KZj0lHdP2mOVmerKzGvYCwcMQzP2';
      const name = 'BrunoT'
      const email = 'bruno@gmail.comT';
      const imageUrl = 'link';
      // Escrever dados no Firebase Realtime Database
      set(ref(database, 'users/' + userId), {
        username: name,
        email: email,
        profile_picture : imageUrl
      });
      await database.set('Isso é um teste de banco de dados Firebase.');
      console.log('Dados escritos no Firebase Realtime Database com sucesso.');
    } catch (error) {
      console.error('Erro ao escrever dados no Firebase Realtime Database:', error);
    }
  };

  const testarStorage = async () => {
    try {
      const storageRef = storage().ref('test/imagem.jpg');
      // Fazer upload de um arquivo para o Firebase Storage
      await storageRef.putFile('caminho/do/arquivo.jpg');
      console.log('Arquivo enviado para o Firebase Storage com sucesso.');
    } catch (error) {
      console.error('Erro ao enviar arquivo para o Firebase Storage:', error);
    }
  };

  const cadastrarPublicacao = async () => {
    try {

      if (!user) {
        Alert.alert('Erro', 'Você deve estar autenticado para cadastrar uma publicação.');
        return;
      }

      const publicacaoRef = database().ref('publicacoes').push({
        userId: user.uid, // Associar ID do usuário autenticado
        titulo,
        descricao,
      });

      const publicacaoId = publicacaoRef.key;

      // Enviar imagens para o Firebase Storage e associar à publicação
      for (let i = 0; i < imagens.length; i++) {
        const imagem = imagens[i];
        const imagemRef = storage().ref(`imagens/${publicacaoId}/imagem${i + 1}.jpg`);
        const response = await fetch(imagem);
        const blob = await response.blob();
        await imagemRef.put(blob);
        const url = await imagemRef.getDownloadURL();
        setImagemUrls([...imagemUrls, url]);
      }

      Alert.alert('Sucesso', 'Publicação cadastrada com sucesso.');
      // Limpar os campos após o cadastro
      setTitulo('');
      setDescricao('');
      setImagens([]);
      setImagemUrls([]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar a publicação. Verifique os dados e tente novamente.');
      console.error(error);
    }
  };

  return (
    <View>
      <Text>{user.nome}</Text>
      <TextInput
        placeholder="Título"
        onChangeText={text => setTitulo(text)}
        value={titulo}
      />
      <TextInput
        placeholder="Descrição"
        onChangeText={text => setDescricao(text)}
        value={descricao}
      />
      <Button title="Escolher Imagem" onPress={escolherImagem} />
      {imagens.map((imagem, index) => (
        <Image
          key={index}
          source={{ uri: imagem }}
          style={{ width: 100, height: 100 }}
        />
      ))}
      <Button title="Cadastrar Publicação" onPress={cadastrarPublicacao} />

      <Button title="Testar Database" onPress={testarDatabase} />
      <Button title="Testar Storage" onPress={testarStorage} />
    </View>
  );
}