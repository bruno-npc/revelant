import React from 'react';
import { View, ScrollView, Text, Image, StyleSheet } from "react-native"
import Carousel, { Pagination } from 'react-native-snap-carousel';

export function Biografia(){
  const images = [
    require('../../assets/img/login_background.jpg'),
    require('../../assets/img/login_background.jpg'),
    require('../../assets/img/login_background.jpg'),
  ];

  const [activeSlide, setActiveSlide] = React.useState(0);

  const renderImageItem = ({ item }) => {
      return (
        <Image source={item} style={styles.slideImage} />
      );
    };


  return (
    <ScrollView>
      <Carousel
        data={images}
        renderItem={renderImageItem}
        sliderWidth={300}
        itemWidth={300}
        onSnapToItem={(index) => setActiveSlide(index)}
      />
      <Pagination
        dotsLength={images.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.paginationDot}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />

      <View style={styles.container}>
        <View style={styles.userStory}>
          <Text style={styles.storyTitle}>Minha História</Text>
          <Text style={styles.storyText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Nullam eget libero sem. Vestibulum ante ipsum primis in
            faucibus orci luctus et ultrices posuere cubilia Curae;
            Phasellus euismod scelerisque sem, ut bibendum libero
            dictum non. Integer vitae erat vitae nisi varius eleifend.
            Vestibulum lobortis elit non tellus vulputate, at faucibus
            erat convallis. Quisque nec ligula at tortor fermentum
            malesuada vel in ante.
          </Text>
        </View>



        <View style={styles.userDonation}>
          <Text style={styles.donationText}>
            Faça uma doação para apoiar meu trabalho
          </Text>
          {/* Adicione aqui um botão de doação, QR code, ou outras informações relacionadas à doação */}
        </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  slider: {
    height: 100,
  },
  slideImage: {
    flex: 1,
    height: 220
  },
  userDonation: {
    marginTop: 16,
  },
  donationText: {
    fontSize: 16,
    fontWeight: 'bold',
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
});