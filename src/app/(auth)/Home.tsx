import React from 'react';
import { View, StyleSheet } from 'react-native';
import HeaderHome from '../../components/HeaderHome/HeaderHome';
import PromotionBanner from './../../components/PromotionBannerHome/PromotionBanner';

const Home = () => {
  return (
    <View style={styles.container}>
      <HeaderHome />
      <PromotionBanner/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Fundo branco para toda a página
  },
});

export default Home;
