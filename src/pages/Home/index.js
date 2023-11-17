import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, View, FlatList, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { db } from '../../../firebase-config';
import { MeusPosts } from '../../components/myPosts';
import { collection, getDocs } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "missao"));
      const postList = [];
      querySnapshot.forEach(doc => {
        postList.push({
          id: doc.id,
          images: doc.data().picture_ref,
          description: doc.data().descricao,
          title: doc.data().titulo,
          autor: doc.data().autor,
          created: doc.data().created,
          likes: doc.data().likes,
          necessidadeMissao: doc.data().necessidadeMissao,
          passosMissao: doc.data().passosMissao,
          andamento: doc.data().andamento
        });
      });
      setPosts(postList);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  }, []);

  const handlePostPress = (post) => {
    navigation.navigate('Missão', { post });
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 20 }}/>
      {loading ? (
        <ActivityIndicator size={50} color="#e52246" />
      ) : posts.length > 0 ? (
        <FlatList
          data={posts}
          keyExtractor={post => post.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePostPress(item)}>
              <MeusPosts
                key={item.id}
                imagemSource={{ uri: item.images[0] }}
                titulo={item.title}
                descricao={item.description}
                andamento={item.andamento}
              />
            </TouchableOpacity>
          )}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>A lista de postagens está vazia.</Text>
          <TouchableOpacity style={styles.reloadButton} onPress={handleRefresh}>
            <Text style={{ color: 'white' }}>Recarregar</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={{ marginBottom: 50 }}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  reloadButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e52246',
    borderRadius: 5,
  },
});