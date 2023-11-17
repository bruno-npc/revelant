import { useContext, useState, useEffect } from 'react';
import {ActivityIndicator, View, ScrollView, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/auth';
import { db } from '../../../firebase-config';
import {LinearGradient} from "expo-linear-gradient"
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Biografia } from '../../components/bioProfile';
import { MeusPosts } from '../../components/myPosts';

export default function Profile() {
  const { signOut } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('postagens');
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const [posts, setPosts] = useState([]);
  const [follow, setFollow] = useState(0);

  const [backgroundProfile, setBackgroundProfile] = useState('');
  const [imgProfile, setImgProfile] = useState('');
  const [userName, setUserName] = useState('');
  const [descricaoBio, setDescricaoBio] = useState('');
  const [historiaProfile, setHistoriaProfile] = useState('');
  const [imgBioProfile, setImgBioProfile] = useState([]);
  const [igreja, setIgreja] = useState('');
  const [religiao, setReligiao] = useState('');
  const [estado, setEstado] = useState('');

    const fetchUser = async () => {
      try {
        const userProfileCollection = collection(db, 'users');
        const q = query(userProfileCollection, where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
          setUserName(doc.data().nome);
          setFollow(doc.data().follow);
          setIgreja(doc.data().igreja);
          setReligiao(doc.data().religiao);
          setEstado(doc.data().estado);
          setDescricaoBio(doc.data().biodescricao);
          setHistoriaProfile(doc.data().historia);
          const images = doc.data().imgbioprofile || [];
          setImgBioProfile(images);
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
      querySnapshot.forEach(doc => {
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imagemContainer}>
        <Image source={require('../../assets/img/background.png')} style={styles.imagem} />
        <LinearGradient
          style={styles.gradient}
          colors={['transparent', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,1)']}
        />
      </View>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require('../../assets/img/pastor.jpg')}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userName}</Text>
          <View style={styles.followersInfo}>
            <Text>{follow} Acompanham    </Text>
            <Text>{posts.length} Missões</Text>
          </View>
          <View style={styles.personalInfo}>
            <Text>{igreja}</Text>
            <Text>{religiao}</Text>
            <Text>{estado}</Text>
          </View>
          <Text style={styles.description}>{descricaoBio}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => signOut()}
      >
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
      <View style={styles.tabsContainer}>
        {/* Aba de Postagens */}
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'postagens' && styles.activeTab,
          ]}
          onPress={() => handleTabChange('postagens')}
        >
          <Text style={styles.tabText}>Missões</Text>
        </TouchableOpacity>
        {/* Aba de Biografia */}
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'biografia' && styles.activeTab,
          ]}
          onPress={() => handleTabChange('biografia')}
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
            {posts.map(post => (
              <MeusPosts
                key={post.id}
                imagemSource={{ uri: post.images[0] }}
                titulo={post.title}
                descricao={post.description}
              />
            ))}
          </View>
        )}
      </View>
    ) : (
      <Biografia historia={historiaProfile} imagens={imgBioProfile} />
    )}
    <View style={{ marginBottom: 50 }}/>
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
  description: {
    marginTop: 10,
    fontSize: 16,
    color: 'gray',
    maxWidth: '90%',
    overflowWrap: 'break-word'
  },
  followersInfo: {
    flexDirection: 'row',
    marginTop: 5,
  },
  imagemContainer: {
    width: '100%'
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
  gradient:{
    flex: 1,
    position:'absolute',
    left:0,
    right:0,
    bottom:0,
    height:'80%',
    width:'100%',
    zIndex:1,
    backgroundColor:'transparent',
    justifyContent: 'center',
    alignItems:'center'
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
  }
});