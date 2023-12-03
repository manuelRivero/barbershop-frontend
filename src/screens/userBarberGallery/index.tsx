import {
  Box,
  HStack,
  Heading,
  Icon,
  Image,
  Pressable,
} from '@gluestack-ui/themed';
import {ChevronLeftIcon} from 'lucide-react-native';
import React, {useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Carousel from 'react-native-snap-carousel';
import {Dimensions} from 'react-native';

const WIDTH = Dimensions.get('window').width;
export default function UserBarberGallery() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const ref = useRef();

  return (
    <>
      <Box bg="$primary100" flex={1}>
        <Box style={{marginTop: 38, marginBottom: 100}}>
          <HStack justifyContent="space-between" alignItems="center">
            <Pressable onPress={() => navigation.goBack()} p={'$4'}>
              <Icon as={ChevronLeftIcon} size={24} color="$textDark500" />
            </Pressable>
            <Heading textAlign="center" color="$textDark500">
              Galeria
            </Heading>
            <Box p="$6"></Box>
          </HStack>
          <Box mt="$4">
            <Carousel
              data={[1, 2, 3, 4, 5]}
              renderItem={({item}) => <CarouselItem img="" />}
              sliderWidth={WIDTH}
              itemWidth={WIDTH * .8}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}

interface CarouselItemProps {
  img: string;
}
const CarouselItem = ({img}: CarouselItemProps) => {
  return (
    <Box borderRadius={'$2xl'} bg="$red100" overflow='hidden'>
        <Image
          source={require('./../../assets/images/image-placeholder.png')}
          alt="imagen del corte"
        />

    </Box>
  );
};
