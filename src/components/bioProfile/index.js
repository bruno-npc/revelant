import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from "react-native"
import Carousel, { Pagination } from 'react-native-snap-carousel';

export function Biografia({ historia, imagens }) {
  const [activeSlide, setActiveSlide] = React.useState(0);

  const renderImageItem = ({ item }) => {
    return (
      <Image source={{ uri: item }} style={styles.slideImage} resizeMode="cover" />
    );
  };

  return (
    <View style={styles.container}>
      {imagens && imagens.length > 0 ? (
        <>
          <Carousel
            data={imagens}
            renderItem={renderImageItem}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={Dimensions.get('window').width}
            onSnapToItem={(index) => setActiveSlide(index)}
            lockScrollWhileSnapping={true}
            snapToInterval={Dimensions.get('window').width}
            snapToAlignment={'start'}
          />
          <Pagination
            dotsLength={imagens.length}
            activeDotIndex={activeSlide}
            containerStyle={styles.paginationContainer}
            dotStyle={styles.paginationDot}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
        </>
      ) : null}

      <View style={styles.userStory}>
        <Text style={styles.storyTitle}>Minha História</Text>
        {historia ? (
          <Text style={styles.storyText}>{historia}</Text>
        ) : null}
      </View>

      <View style={styles.userDonation}>
        <Text style={styles.donationText}>
          Faça uma doação para apoiar meu trabalho
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slideImage: {
    width: '100%',
    height: 220,
  },
  userDonation: {
    marginTop: 16,
  },
  donationText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 50,
  },
  userStory: {
    marginTop: 16,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  storyText: {
    fontSize: 14,
  },
  paginationContainer: {
    paddingVertical: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
    backgroundColor: '#9372F1',
  },
});