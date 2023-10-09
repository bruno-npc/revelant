import { useContext, useState } from 'react';

import { Biografia } from '../../components/bioProfile';
import { MeusPosts } from '../../components/myPosts';
import {View, Button, SafeAreaView, ScrollView, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/auth';
import {LinearGradient} from "expo-linear-gradient"

export default function Profile() {
  const { signOut } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('postagens');
  const [church, setChurch] = useState('Igreja');
  const [state, setState] = useState('Estado');
  const [religion, setReligion] = useState('Religião');

  const [description, setDescription] = useState('Descrição Lorem ipsum dolor sit amet, consectetur adipiscing elit. ');
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

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
          <Text style={styles.profileName}>João</Text>
          <View style={styles.followersInfo}>
            <Text>100 Acompanham    </Text>
            <Text>52 Missões</Text>
          </View>
          <View style={styles.personalInfo}>
            <Text>{church}</Text>
            <Text>{religion}</Text>
            <Text>{state}</Text>
          </View>
          <Text style={styles.description}>{description}</Text>
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
        <MeusPosts
          imagemSource={require('../../assets/img/login_background.jpg')}
          descricao="Esta é uma descrição de exemplo para a postagem 1."
        />
        <MeusPosts
          imagemSource={require('../../assets/img/login_background.jpg')}
          descricao="Esta é uma descrição de exemplo para a postagem 2."
        />
        <MeusPosts
          imagemSource={require('../../assets/img/biblia.jpg')}
          descricao="Esta é uma descrição de exemplo para a postagem 2."
        />
        <MeusPosts
          imagemSource={require('../../assets/img/login_background.jpg')}
          descricao="Esta é uma descrição de exemplo para a postagem 2."
        />
        <MeusPosts
          imagemSource={require('../../assets/img/biblia.jpg')}
          descricao="Esta é uma descrição de exemplo para a postagem 2."
        />
      </View>
      ) : (
        <Biografia/>
      )}
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
    alignItems: 'center',
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
    overflowWrap: 'break-word',
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
    width: 100, // Largura desejada
    height: 40,  // Altura desejada
    backgroundColor: 'red', // Cor de fundo
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5, // Cantos arredondados, se desejar
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  }
});