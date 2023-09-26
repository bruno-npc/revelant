import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, Image } from 'react-native';

import { getStorage, ref, uploadBytes } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { AuthContext } from '../../contexts/auth';
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '../../../firebase-config';

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
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      console.log(result.uri)
      console.log(result.assets[0].uri)
      setImagens([...imagens, result.assets[0].uri]);
    }
  };

  const testarDatabase = async () => {
      await setDoc(doc(db, "user", "user.id"), {
        name: "Teste",
        email: "teste"
      });
    };
  

  const testarStorage = async () => {
 // Função para fazer o upload de imagens
 console.log(imagens)
 const storage = getStorage();
  try {
      const uploadPromises = imagens.map(async (image, index) => {
      const imageName = `image_${index + 1}.jpg`; // Nome da imagem no Storage
      const storageRef = ref(storage, imageName);
      await uploadBytes(storageRef, image);

      console.log(`Imagem ${index + 1} enviada com sucesso!`);
    });
    const uploadResults = await Promise.all(uploadPromises);

    // uploadResults agora contém as URLs de todas as imagens enviadas
    console.log("URLs das imagens enviadas:", uploadResults);
    return uploadResults;
  } catch (error) {
    console.error("Erro ao enviar imagens:", error);
    throw error;
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