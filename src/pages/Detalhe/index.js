import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

export default function Detalhe({ route }) {
  const { post } = route.params;
  const [liked, setLiked] = useState(false);
  const [activeSlide, setActiveSlide] = React.useState(0);

  const renderImageItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.slideImage} />
  );

  return (
    <ScrollView style={styles.container}>
      <Carousel
        data={post.images}
        renderItem={renderImageItem}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={Dimensions.get('window').width}
        onSnapToItem={(index) => setActiveSlide(index)}
        lockScrollWhileSnapping={true}
        snapToInterval={Dimensions.get('window').width}
        snapToAlignment={'start'}
      />
      <Pagination
        dotsLength={post.images.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.paginationDot}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />

      <View style={styles.postInfoContainer}>
        <TouchableOpacity
          style={styles.authorContainer}
          onPress={() => console.log('Author clicked')}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require('../../assets/img/pastor.jpg')}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.authorName}>{post.autor}</Text>
        </TouchableOpacity>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postDescription}>{post.description}</Text>

        <Text style={styles.postTitle}>Necessidades da Missão:</Text>
        {post.necessidadeMissao.map((necessidade, index) => (
          <Text key={index} style={styles.listItem}>{necessidade}</Text>
        ))}

      <Text style={styles.postTitle}>Passos da Missão:</Text>
        {post.passosMissao.map((passo, index) => (
          <View key={index} style={styles.passoContainer}>
            <Text style={styles.passoTitle}>{`Passo ${index + 1}:`}</Text>
            <Text style={styles.listItemTitle}>{passo.titulo}</Text>
            <Text style={styles.listItem}>{passo.descricao}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => setLiked(!liked)}>
          <Text style={liked ? styles.likedText : styles.actionText}>
            {liked ? 'Curtido' : 'Curtir'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Comment clicked')}>
          <Text style={styles.actionText}>Comentar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Share clicked')}>
          <Text style={styles.actionText}>Compartilhar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.commentContainer}>
        <Image source={{ uri: post.authorImage }} style={styles.commentAuthorImage} />
        <TextInput
          style={styles.commentInput}
          placeholder="Adicione um comentário..."
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  postInfoContainer: {
    margin: 16,
    
  },
  slideImage: {
    width: '100%',
    height: 220,
  },
  profileImageContainer: {
    width: 35,
    height: 35,
    borderRadius: 40,
    overflow: 'hidden',
    padding: 5
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'grey',
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#9372F1'
  },
  postDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 16,
  },
  actionText: {
    fontSize: 16,
  },
  likedText: {
    fontSize: 16,
    color: 'blue',
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  commentAuthorImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  commentInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },  
  passoContainer: {
    marginLeft: 20,
  },
  passoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'green'
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: 10
  },
  listItem: {
    fontSize: 14,
    marginBottom: 5,
  },
  listItemTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
});