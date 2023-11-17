import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, Text, TextInput, Button, Alert, Image, StyleSheet, Modal , TouchableOpacity} from 'react-native';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection,  addDoc } from "firebase/firestore"; 
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { AuthContext } from '../../contexts/auth';
import { db } from '../../../firebase-config';

export default function NewPost() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagens, setImagens] = useState([]);
  const [imagemUrls, setImagemUrls] = useState([]);
  const { user } = useContext(AuthContext);
  const [necessidades, setNecessidades] = useState([]);
  const [necessidadeAtual, setNecessidadeAtual] = useState('');
  const [passos, setPassos] = useState([]);
  const [passoTitulo, setPassoTitulo] = useState('');
  const [passoDescricao, setPassoDescricao] = useState('');
  const [passoEmEdicao, setPassoEmEdicao] = useState(null);

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
        reject(new TypeError("Falha no request."));
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

      await addDoc(collection(db, 'missao'), {
        titulo: titulo,
        descricao: descricao,
        picture_ref: uploadResults,
        necessidadeMissao: necessidades,
        passosMissao: passos,
        likes: 0,
        created: new Date(),
        andamento: true,
        autor: user.nome,
        userId: user.uid,
        userImg: ''
      });

      clearAll();
    } catch (error) {
      console.error('Erro ao realizar a postagem:', error);
      throw error;
    }
  };
    const clearAll = () => {
      setPassos([]); 
      setNecessidades([]); 
      setTitulo('');
      setDescricao('');
      setImagens([]);
      setImagemUrls([]);
      setNecessidadeAtual('');
      setPassoTitulo('');
      setPassoDescricao('');
    };

  const adicionarNecessidade = () => {
    setNecessidades([...necessidades, necessidadeAtual]);
    setNecessidadeAtual('');
  };

  const adicionarPasso = () => {
    if (passoEmEdicao !== null) {
      // Modo de edição
      const novosPassos = [...passos];
      novosPassos[passoEmEdicao] = {
        titulo: passoTitulo,
        descricao: passoDescricao,
      };
      setPassos(novosPassos);
      setPassoEmEdicao(null);
    } else {
      // Adicionar um novo passo
      setPassos([...passos, { titulo: passoTitulo, descricao: passoDescricao }]);
    }
    setPassoTitulo('');
    setPassoDescricao('');
  };

  const editarPasso = (index) => {
    const passoSelecionado = passos[index];
    setPassoTitulo(passoSelecionado.titulo);
    setPassoDescricao(passoSelecionado.descricao);
    setPassoEmEdicao(index);
  };

  const removerPasso = (index) => {
    const novosPassos = passos.filter((_, i) => i !== index);
    setPassos(novosPassos);
    setPassoEmEdicao(null);
  };

  const removerNecessidade = (index) => {
    const novasNecessidades = [...necessidades];
    novasNecessidades.splice(index, 1);
    setNecessidades(novasNecessidades);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Criar Missão</Text>
      <TextInput
        placeholder="Título"
        style={styles.input}
        value={titulo}
        onChangeText={text => setTitulo(text)}
      />
      <TextInput
        placeholder="Descrição"
        style={styles.input}
        value={descricao}
        onChangeText={text => setDescricao(text)}
      />

      <View style={styles.borda}>
        {imagens.map((imagem, index) => (
          <Image
            key={index}
            source={{ uri: imagem }}
            style={styles.imagem}
          />
        ))}
      </View>
      <Button
        title="Adicionar Imagens"
        onPress={escolherImagem}
        color="#9372F1"
        style={styles.botao}
      />

      <Text style={styles.titulo}>Necessidades:</Text>
      <TextInput
        placeholder="Necessidade"
        onChangeText={text => setNecessidadeAtual(text)}
        value={necessidadeAtual}
        style={styles.input}
      />
      { necessidades.map((necessidade, index) => (
        <View key={index} style={styles.necessidadeContainer}>
          <Text style={styles.necessidade}>{necessidade}</Text>
          <TouchableOpacity
            style={styles.removerButton}
            onPress={() => removerNecessidade(index)}
          >
            <Text style={styles.buttonText}>X</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Button
        title="Adicionar Necessidade"
        onPress={adicionarNecessidade}
        color="#9372F1"
        style={styles.botao}
      />
      <Text style={styles.titulo}>Passos da Missão:</Text>
      <TextInput
        placeholder="Título do Passo"
        onChangeText={(text) => setPassoTitulo(text)}
        value={passoTitulo}
        style={styles.input}
      />
      <TextInput
        placeholder="Descrição do Passo"
        onChangeText={(text) => setPassoDescricao(text)}
        value={passoDescricao}
        style={styles.input}
      />
      <Button
        title={passoEmEdicao !== null ? 'Salvar Passo' : 'Adicionar Passo'}
        onPress={adicionarPasso}
        color="#9372F1"
      />
      {passos.map((passo, index) => (
        <View key={index} style={styles.passoContainer}>
          <Text style={styles.passoTitulo}>Título: {passo.titulo}</Text>
          <Text style={styles.passoDescricao}>Descrição: {passo.descricao}</Text>
          <View style={styles.botoesContainer}>
            <TouchableOpacity
              style={[styles.editarRemoverButton, { backgroundColor: '#9372F1' }]}
              onPress={() => editarPasso(index)}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.editarRemoverButton, { backgroundColor: '#f17272' }]}
              onPress={() => removerPasso(index)}
            >
              <Text style={styles.buttonText}>Remover</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <Button
        title="Cadastrar Publicação"
        onPress={realizarPostagem}
        color="#9372F1"
        style={styles.botao}
      />
      <View style={{ marginBottom: 50 }}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#000',
    padding: 8,
    borderWidth: 1,
    borderColor: '#9372F1',
    borderRadius: 5,
    marginTop: 10
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  necessidadeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5
  },
  necessidade: {
    padding: 5
  },
  removerButton: {
    backgroundColor: 'red',
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  editarRemoverButton: {
    flex: 0.5,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  borda: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  imagem: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginBottom: 10,
  },
  botao: {
    marginBottom: 10,
    marginTop: 10,
    padding: 20
  },
  titulo: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
  },
  modalContainer: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  modalTitulo: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
  },
  passoContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  passoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  passoDescricao: {
    fontSize: 16,
  },
  editarPasso: {
    color: 'blue',
  },
  removerPasso: {
    color: 'red',
  },
});