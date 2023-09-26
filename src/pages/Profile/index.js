import { useContext, useState } from 'react';

import { Biografia } from '../../components/bioProfile';
import { MeusPosts } from '../../components/myPosts';
import {View, Button, SafeAreaView, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/auth';

export default function Profile() {
  const { signOut } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('postagens'); // Estado para controlar a aba ativa

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require('../../assets/img/login_background.jpg')}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Nome do Usuário</Text>
          <View style={styles.followersInfo}>
            <Text>Seguidores: 100          </Text>
            <Text>Publicações: 50</Text>
          </View>
        </View>
      </View>
      <Button color={'red'} title='Sair' onPress={() => signOut()} />
      <View style={styles.tabsContainer}>
        {/* Aba de Postagens */}
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'postagens' && styles.activeTab,
          ]}
          onPress={() => handleTabChange('postagens')}
        >
          <Text style={styles.tabText}>Postagens</Text>
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
        <MeusPosts/>
      ) : (
        <Biografia/>
      )}
    </View>
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
  followersInfo: {
    flexDirection: 'row',
    marginTop: 5,
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
  }
});