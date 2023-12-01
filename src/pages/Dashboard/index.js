import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../../firebase-config';
import { collection, getDocs } from "firebase/firestore";
import { AuthContext } from '../../contexts/auth';
import {LinearGradient} from "expo-linear-gradient"

function Dashboard() {
  const { signed } = useContext(AuthContext);
  const navigation = useNavigation();

  const [qtdUser, setqtdUser] = useState(0);
  const [qtdMissoes, setqtdMissoes] = useState(0);

  const fetchQtdUser = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const qtdUserArray = [];
      querySnapshot.forEach(doc => {
        qtdUserArray.push({
          email: doc.email
        });
      });
      setqtdUser(qtdUserArray.length);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const fetchQtdMissoes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "missao"));
      const qtdMissoesArray = [];
      querySnapshot.forEach(doc => {
        qtdMissoesArray.push({
          data: doc.created
        });
      });
      setqtdMissoes(qtdMissoesArray.length);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    fetchQtdUser();
    fetchQtdMissoes();
  }, []);

  const navigateToNextScreen = () => {
    navigation.navigate(signed ? 'AppRoutes' : 'AuthRoutes');
  };

  return (
    <LinearGradient colors={['#800080', '#FFFFFF']} style={styles.container}>
      <TouchableOpacity style={styles.botaoLogin} onPress={navigateToNextScreen}>
        <Text style={styles.botaoTexto}>Login</Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.title}>Revelant App</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.userText}>{`Temos ${qtdUser} usuários!`}</Text>
        <Text style={styles.missoesText}>{`E ${qtdMissoes} Missões cadastradas!`}</Text>
      </View>
      <View style={styles.callToAction}>
        <Text style={styles.callToActionText}>Explore a inspiração divina! </Text>
        <Text style={styles.callToActionText}>Descubra trabalhos religiosos significativos realizados por nossa comunidade. Junte-se a nós na busca pela fé e compartilhe sua jornada espiritual. Faça a diferença agora!</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoLogin: {
    position: 'absolute',
    top: 55,
    right: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#9372F1',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    zIndex: 1,
  },
  botaoTexto: {
    fontSize: 16,
    color: 'white',
  },
  header: {
    position: 'absolute',
    top: 150,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#9372F1',
    padding: 50,
    borderRadius: 70,
    backgroundColor: 'white'
  },
  info:{
    flexDirection: 'row',
    margin: 40,
    top: 15
  },
  userText: {
    backgroundColor:'#9372F1',
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
    padding: 15,
    borderRadius: 15
  },
  missoesText: {
    backgroundColor:'#9372F1',
    fontSize: 18,
    color: 'white',
    marginTop: 20,
    padding: 15,
    borderRadius: 15
  },
  callToAction: {
    marginTop: 15,
    backgroundColor:'white',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callToActionText: {
    fontSize: 18,
    color: '#9372F1',
  }
});

export default Dashboard;