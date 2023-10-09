import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, Image } from 'react-native';

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { AuthContext } from '../../contexts/auth';
import { auth, db } from '../../../firebase-config';
import { getDatabase, ref as refDatabase, set as setDatabase } from "firebase/database";

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

  const getBlobFromUri = async (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  };

  const escolherImagem = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      setImagens([...imagens, result.assets[0].uri]);
    }
  };

  const realizarPostagem = async () => {
    const storage = getStorage();
    try {
      const uploadPromises = imagens.map(async (image, index) => {
        const imageName = `image_${index + 1}.jpg`;
        const storageRef = ref(storage, imageName);
        const imageBlob = await getBlobFromUri(image);
        await uploadBytes(storageRef, imageBlob);
        const imageUrl = await getDownloadURL(storageRef);
        return imageUrl;
      });
      const uploadResults = await Promise.all(uploadPromises);
      setImagemUrls([...imagemUrls, ...uploadResults]);
      console.log('upload realizado com sucesso: ', uploadResults)
      const db = getDatabase();
      setDatabase(refDatabase(db, 'missao/' + user.uid), {
        titulo: titulo,
        descricao: descricao,
        picture_ref: uploadResults
      });
      console.log('Postagem realizada com sucesso');
    } catch (error) {
      console.error('Erro ao realizar a postagem:', error);
      throw error;
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
      <Button title="Cadastrar Publicação" onPress={realizarPostagem} />
    </View>
  );
}