import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';

export default  ProfileEdit = ({ route }) => {
  const { userID, db } = route.params;
  const navigation = useNavigation();
  
  const [igreja, setIgreja] = useState('');
  const [religiao, setReligiao] = useState('');
  const [estado, setEstado] = useState('');
  const [descricaoBio, setDescricaoBio] = useState('');
  const [imgBioProfile, setImgBioProfile] = useState([]);
  
  const [newImgProfile, setNewImgProfile] = useState(null);
  const [userName, setUserName] = useState('');
  const [historiaProfile, setHistoriaProfile] = useState('');
  const [editedIgreja, setEditedIgreja] = useState('');
  const [editedReligiao, setEditedReligiao] = useState('');
  const [editedEstado, setEditedEstado] = useState('');
  const [editedDescricao, setEditedDescricao] = useState('');
  const [editedHistoria, setEditedHistoria] = useState('');
  const [editedName, setEditedName] = useState('');
  const [editedImagem, setEditedImagem] = useState('');
  
  
  const fetchUser = async () => {
    try {
      const userProfileCollection = collection(db, 'users');
      const q = query(userProfileCollection, where('uid', '==', userID));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUserName(doc.data().nome);
        setEditedName(doc.data().nome);
        setIgreja(doc.data().igreja);
        setEditedImagem(doc.data().imgprofile);
        setReligiao(doc.data().religiao);
        setEstado(doc.data().estado);
        setDescricaoBio(doc.data().biodescricao);
        setHistoriaProfile(doc.data().historia);
        setEditedHistoria(doc.data().historia);
        const images = doc.data().imgbioprofile || [];
        setImgBioProfile(images);
        setEditedIgreja(doc.data().igreja);
        setEditedReligiao(doc.data().religiao);
        setEditedEstado(doc.data().estado);
        setEditedDescricao(doc.data().biodescricao);
      });
    } catch (error) {
      console.error('Erro ao buscar o nome do usuário:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleUpdateProfile = async () => {
    const storage = getStorage();
    try {
      let newImage = null;
      if (newImgProfile !== null) {
        const imageName = `image_${new Date()}.jpg`;
        const storageRef = ref(storage, imageName);
        const imageBlob = await getBlobFromUri(newImgProfile);
        await uploadBytes(storageRef, imageBlob);
        newImage = await getDownloadURL(storageRef);
      }
      updateUserProfile(userID, {
        igreja: editedIgreja,
        religiao: editedReligiao,
        estado: editedEstado,
        descricao: editedDescricao,
        nome: editedName,
        historia: editedHistoria,
        imgprofile: newImage !== null ? newImage : editedImagem,
      });
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
    }
    fetchUser();
    navigation.goBack();
  };

  const updateUserProfile = async (userId, newData) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        await updateDoc(userDocRef, newData);
        fetchUser();
      } else {
        console.error('Erro: Usuário não encontrado no banco de dados.');
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  const escolherImagem = async (type) => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log(result);
      if (!result.cancelled) {
        setNewImgProfile(result.uri);
      }
    };

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

  return (
    <View style={styles.container}>
      <View>
          <TouchableOpacity style={styles.profileImageBut} onPress={() => escolherImagem('profile')}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: newImgProfile !== null && newImgProfile !== '' ? newImgProfile : editedImagem }}
                style={styles.profileImage}
              />
            </View>
            <Text style={styles.textButtonImg}>Editar imagem.</Text>
          </TouchableOpacity>
      </View>
      <Text style={styles.tituloInput}>Nome:</Text>
      <TextInput
        placeholder="Nome"
        value={editedName}
        onChangeText={(text) => setEditedName(text)}
        style={styles.input}
        edit={editedName}
      />
      <Text style={styles.tituloInput}>História:</Text>
      <TextInput
        placeholder="Sua História"
        value={editedHistoria}
        onChangeText={(text) => setEditedHistoria(text)}
        style={styles.input}
        edit={editedHistoria}
      />
      <Text style={styles.tituloInput}>Igreja:</Text>
      <TextInput
        placeholder="Igreja"
        value={editedIgreja}
        onChangeText={(text) => setEditedIgreja(text)}
        style={styles.input}
        edit={editedIgreja}
      />
      <Text style={styles.tituloInput}>Religião:</Text>
      <TextInput
        placeholder="Religião"
        value={editedReligiao}
        onChangeText={(text) => setEditedReligiao(text)}
        style={styles.input}
        edit={editedReligiao}
      />
      <Text style={styles.tituloInput}>Estado:</Text>
      <TextInput
        placeholder="Estado"
        value={editedEstado}
        onChangeText={(text) => setEditedEstado(text)}
        style={styles.input}
        edit={editedEstado}
       />
       <Text style={styles.tituloInput}>Biografia:</Text>
       <TextInput
        placeholder="Biografia"
        value={editedDescricao}
        onChangeText={(text) => setEditedDescricao(text)}
        style={styles.input}
        edit={editedDescricao}
      />
      <View style={styles.containerButton}>
        <TouchableOpacity style={styles.buttonSave} onPress={handleUpdateProfile}>
                <Text style={styles.textButton}>Salvar</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 14,
    paddingTop: 36,
  },
  containerButton:{
    justifyContent: 'center',
    alignItems: 'center',
  },
  tituloInput: {
    fontSize:12, 
    fontWeight: 'bold',
    marginTop: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginBottom: 10
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
  textButton:{
    fontWeight: 'bold',
    color: 'white'
  },
  textButtonImg:{
    fontWeight: 'bold',
    marginLeft: 15,
    marginTop: 28
  },
  buttonSave:{
    backgroundColor: '#9372F1',
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    marginBottom: 10,
    marginTop: 10,
    padding: 20,
    borderRadius: 25
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#ccc',
  },
  profileImageBut:{
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: '#9372F1',
    borderRadius: 10,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  }
});