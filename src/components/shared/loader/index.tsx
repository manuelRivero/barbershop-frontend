import React from 'react';
import LottieView from 'lottie-react-native';
import {Box, VStack} from '@gluestack-ui/themed';

export default function Loader() {
  return (
    <Box flex={1} bg={"$primary100"}>
      <VStack flex={1} justifyContent="center" alignItems='center'>
        <LottieView
          style={{width: 150, height: 150}}
          source={require('./../../../assets/lottie/loading.json')}
          autoPlay
          loop={true}
        />
      </VStack>
    </Box>
  );
}
