import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Feather from 'react-native-vector-icons/Feather'
import { LinearGradient } from "expo-linear-gradient"

export function MeusPosts({ imagemSource, titulo, descricao, andamento }) {
  const andamentoText = andamento ? "Em andamento" : "Finalizado";
  const corFundo = andamento ? '#32a852' : 'red';

  return (
    <View style={styles.container}>
      <View style={styles.imagemContainer}>
        <Image source={imagemSource} style={styles.imagem} />
        <LinearGradient
          style={styles.gradient}
          colors={['transparent', 'rgba(0,0,0,0.70)', 'rgba(0,0,0,0.95)']}
        />
        <Text style={{ position: 'absolute', color: '#fff', bottom: 14, zIndex: 99, left: '2%' }}>
          {titulo}
        </Text>
        {andamento && (
          <View style={{
            position: 'absolute',
            bottom: 14,
            zIndex: 99,
            left: '70%',
          }}>
            <Text style={{
              backgroundColor: '#32a852',
              padding: 5,
              borderRadius: 5,
              color: '#fff',
            }}>
              {andamentoText}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.textoContainer}>
        <View style={styles.iconesContainer}>
          <Feather name='thumbs-up' color={'black'} size={20} />
          <Feather name='star' color={'black'} size={20} />
          <Feather name='heart' color={'black'} size={20} />
        </View>
        <Text style={styles.descricao}>
          {descricao.length > 250
            ? descricao.substring(0, 250) + "..."
            : descricao}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
    flexDirection: "column",
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'grey',
  },
  gradient: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '55%',
    width: '100%',
    zIndex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imagemContainer: {
    width: '100%',
    marginBottom: 8,
  },
  imagem: {
    width: '100%',
    height: 200,
    borderRadius: 4,
  },
  textoContainer: {
    marginBottom: 8,
  },
  iconesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  descricao: {
    fontSize: 16,
    color: '#000',
  },
});