import React, { useContext, useState, useEffect } from 'react';
import { ActivityIndicator, View, ScrollView, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { AuthContext } from '../../contexts/auth';
import { db } from '../../../firebase-config';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { Biografia } from '../../components/bioProfile';
import { MeusPosts } from '../../components/myPosts';
import * as ImagePicker from 'expo-image-picker';

export default function Profile() {
  const { signOut } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('postagens');
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const [posts, setPosts] = useState([]);
  const [follow, setFollow] = useState(0);

  const [backgroundProfile, setBackgroundProfile] = useState(null);
  const [imgProfile, setImgProfile] = useState(null);
  const [userName, setUserName] = useState('');
  const [descricaoBio, setDescricaoBio] = useState('');
  const [historiaProfile, setHistoriaProfile] = useState('');
  const [imgBioProfile, setImgBioProfile] = useState([]);
  const [igreja, setIgreja] = useState('');
  const [religiao, setReligiao] = useState('');
  const [estado, setEstado] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [editedIgreja, setEditedIgreja] = useState(igreja);
  const [editedReligiao, setEditedReligiao] = useState(religiao);
  const [editedEstado, setEditedEstado] = useState(estado);
  const [editedDescricao, setEditedDescricao] = useState(descricaoBio);

  const [editingHistoria, setEditingHistoria] = useState(false);
  const [editedHistoria, setEditedHistoria] = useState(historiaProfile);
  
  const handleEditHistoria = () => {
    setEditingHistoria(true);
  };
  const handleSaveHistoria = () => {
    updateUserProfile(user.uid, {
      historia: editedHistoria,
    });
    setEditingHistoria(false);
  };

  const fetchUser = async () => {
    try {
      const userProfileCollection = collection(db, 'users');
      const q = query(userProfileCollection, where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUserName(doc.data().nome);
        setFollow(doc.data().follow);
        setIgreja(doc.data().igreja);
        setReligiao(doc.data().religiao);
        setEstado(doc.data().estado);
        setDescricaoBio(doc.data().biodescricao);
        setHistoriaProfile(doc.data().historia);
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const fetchDataPosts = async () => {
    try {
      const q = query(collection(db, 'missao'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const postList = [];
      querySnapshot.forEach((doc) => {
        postList.push({
          id: doc.id,
          images: doc.data().picture_ref,
          description: doc.data().descricao,
          title: doc.data().titulo,
        });
      });
      setPosts(postList);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchDataPosts();
  }, []);

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
      if (type === 'profile') {
        setImgProfile(result.uri);
      } else if (type === 'background') {
        setBackgroundProfile(result.uri);
      }
      updateUserProfile(user.uid, {
        imgprofile: result.uri,
        backgroundprofile: type === 'background' ? result.uri : backgroundProfile,
      });
    }
  };

  const handleUpdateProfile = async () => {
    updateUserProfile(user.uid, {
      igreja: editedIgreja,
      religiao: editedReligiao,
      estado: editedEstado,
      biodescricao: editedDescricao
    });
    fetchUser();
    setEditMode(false);
  };

  const handleCancelEdit = () => {
    setEditedIgreja(igreja);
    setEditedReligiao(religiao);
    setEditedEstado(estado);
    setEditedDescricao(descricaoBio);
    setEditMode(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imagemContainer}>
        <TouchableOpacity onPress={() => escolherImagem('background')}>
          <Image
            source={
              backgroundProfile
                ? { uri: backgroundProfile }
                : require('../../assets/img/background.png')
            }
            style={styles.imagem}
          />
        </TouchableOpacity>
        <LinearGradient
          style={styles.gradient}
          colors={['transparent', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,1)']}
        />
      </View>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={() => escolherImagem('profile')}>
          <View style={styles.profileImageContainer}>
            <Image
              source={
                imgProfile
                  ? { uri: imgProfile }
                  : require('../../assets/img/pastor.jpg')
              }
              style={styles.profileImage}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userName}</Text>
          <View style={styles.followersInfo}>
            <Text>{follow} Acompanham </Text>
            <Text>{posts.length} Missões</Text>
          </View>
          {editMode ? (
            <View style={styles.editScrollView}>
              <TextInput
                style={styles.input}
                value={editedIgreja}
                onChangeText={setEditedIgreja}
                placeholder="Igreja"
              />
              <TextInput
                style={styles.input}
                value={editedReligiao}
                onChangeText={setEditedReligiao}
                placeholder="Religião"
              />
              <TextInput
                style={styles.input}
                value={editedEstado}
                onChangeText={setEditedEstado}
                placeholder="Estado"
              />
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={editedDescricao}
                onChangeText={setEditedDescricao}
                placeholder="Descrição"
                multiline={true}
                numberOfLines={4}
              />
            </View>
          ) : (
            <View style={styles.personalInfo}>
              <Text>{igreja}</Text>
              <Text>{religiao}</Text>
              <Text>{estado}</Text>
              <Text style={styles.description}>{descricaoBio}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => signOut()}>
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
        {editMode ? (
          <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => setEditMode(true)}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.tabsContainer}>
        {/* Aba de Postagens */}
        <TouchableOpacity
          style={[styles.tab, activeTab === 'postagens' && styles.activeTab]}
          onPress={() => setActiveTab('postagens')}
        >
          <Text style={styles.tabText}>Missões</Text>
        </TouchableOpacity>
        {/* Aba de Biografia */}
        <TouchableOpacity
          style={[styles.tab, activeTab === 'biografia' && styles.activeTab]}
          onPress={() => setActiveTab('biografia')}
        >
          <Text style={styles.tabText}>Biografia</Text>
        </TouchableOpacity>
      </View>
      {/* Conteúdo da aba selecionada */}
      {activeTab === 'postagens' ? (
        <View>
          {loading ? (
            <ActivityIndicator size={50} color="#e52246" />
          ) : (
            <View>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <MeusPosts
                    key={post.id}
                    imagemSource={{ uri: post.images[0] }}
                    titulo={post.title}
                    descricao={post.description}
                    andamento={post.andamento}
                  />
                ))
              ) : (
                <View>
                  <Text>Nenhuma missão encontrada.</Text>
                  <TouchableOpacity
                    style={styles.fetchButton}
                    onPress={fetchDataPosts}
                  >
                    <Text style={styles.buttonText}>Buscar Novos Posts</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      ) : (
        <View>
          {editingHistoria ? (
            <>
              <TextInput
                style={styles.input}
                value={editedHistoria}
                onChangeText={setEditedHistoria}
                multiline
                placeholder="Digite sua nova história..."
              />
              <TouchableOpacity style={styles.button} onPress={handleSaveHistoria}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.editHistoria} onPress={handleEditHistoria}>
                <Text>{editingHistoria ? 'Cancelar' : 'Editar Minha história'}</Text>
              </TouchableOpacity>
              <Biografia historia={historiaProfile} imagens={imgBioProfile} />
            </>
          )}
        </View>
      )}
      <View style={{ marginBottom: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 14,
    paddingTop: 36,
  },
  editHistoria:{
    width: '100%',
    padding: 16, 
    backgroundColor: '#9372F1', 
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    margin: 5
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
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileInfo: {
    marginLeft: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  personalInfo: {
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    padding: 8,
  },
  description: {
    marginTop: 10,
    fontSize: 16,
    color: 'gray',
    maxWidth: '90%',
  },
  followersInfo: {
    flexDirection: 'row',
    marginTop: 5,
  },
  imagemContainer: {
    width: '100%',
  },
  imagem: {
    width: '100%',
    height: 150,
    borderRadius: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    marginTop: 10,
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#9372F1',
  },
  tab: {
    borderBottomWidth: 2,
    borderColor: 'blue',
    paddingVertical: 10,
  },
  tabText: {
    fontWeight: 'bold',
  },
  gradient: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '80%',
    width: '100%',
    zIndex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    width: 100,
    height: 40,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  editScrollView: {
    maxWidth: '90%',
  },
  multilineInput: {
    height: 80,
  },
});