import {
  Box,
  HStack,
  Heading,
  Icon,
  Image,
  Pressable,
} from '@gluestack-ui/themed';
import { ChevronLeftIcon } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Carousel from 'react-native-snap-carousel';
import { Dimensions, Text } from 'react-native';
import { useGetImagesFromBarberQuery, useGetImagesQuery } from '../../api/galleryApi';
import LinearGradient from 'react-native-linear-gradient';

const width = Dimensions.get('window').width;
export default function UserBarberGallery({route}: any) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {id} = route.params;
  const { data, isLoading, refetch } = useGetImagesFromBarberQuery({id: id})

  console.log("images data", data)

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={['#fff', '#f1e2ca']}
      start={{ x: 0, y: 0.6 }}
      end={{ x: 0, y: 1 }}>
      <Box flex={1} position='relative'>
        <Box
          borderRadius={9999}
          w={width * 3}
          h={width * 3}
          position="absolute"
          bg="#f1e2ca"
          overflow="hidden"
          top={-width * 2.75}
          left={-width}
          opacity={0.5}
        />
            <HStack justifyContent="space-between" alignItems="center" p={'$4'}>
              <Pressable onPress={() => navigation.goBack()} p={'$4'}>
                <Icon as={ChevronLeftIcon} size={24} color="$textDark500" />
              </Pressable>
              <Heading textAlign="center" color="$textDark500">
                Galería
              </Heading>
              <Box p="$6"></Box>
            </HStack>
            <Box mt="$10" flex={1} justifyContent='center' alignItems='center'>
              {data && data.data.length > 0 
              ? (<Carousel
                data={data ? data.data : []}
                renderItem={({ item }) => <CarouselItem img={item.url} />}
                sliderWidth={width}
                itemWidth={width * .8}
              />)
              : (<Text>Este barbero no ha subido fotos</Text>)}
            </Box>
      </Box>
    </LinearGradient>
  );
}

interface CarouselItemProps {
  img: string;
}
const CarouselItem = ({ img }: CarouselItemProps) => {
  console.log("Img carousel", img)
  return (
    <Box borderRadius={'$2xl'} bg="$red100" overflow='hidden'>
      <Image
        source={{ uri: img }}
        alt="imagen del corte"
        width={width * .8}
        height={300}
        resizeMode='cover'
      />

    </Box>
  );
};
