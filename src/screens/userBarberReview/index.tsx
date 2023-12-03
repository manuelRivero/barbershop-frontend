import {FlatList, Image, Text, VStack} from '@gluestack-ui/themed';
import {Box, HStack, Heading, Icon, Pressable} from '@gluestack-ui/themed';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ChevronLeftIcon} from 'lucide-react-native';
import React, {useEffect, useState} from 'react';
import {ListRenderItemInfo} from 'react-native';
import {AirbnbRating} from 'react-native-ratings';
import BaseButton from '../../components/shared/baseButton';
import ReviewModal from '../../components/userBarberReview/reviewModal';

const AvatarPlaceholder = require('./../../assets/images/avatar-placeholder.jpeg');

export default function UserBarberReview({route}: any) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [open, setOpen] = useState<boolean>(false);
  const {id} = route.params;
  return (
    <>
      <Box bg="$primary100" flex={1}>
        <Box style={{marginTop: 38, marginBottom: 100}}>
          <HStack justifyContent="space-between" alignItems="center">
            <Pressable onPress={() => navigation.goBack()} p={'$4'}>
              <Icon as={ChevronLeftIcon} size={24} color="$textDark500" />
            </Pressable>
            <Heading textAlign="center" color="$textDark500">
              Calificaciones
            </Heading>
            <Box p="$6"></Box>
          </HStack>
          <FlatList
            contentContainerStyle={{paddingBottom: 50}}
            p="$4"
            data={[1, 2, 3, 4]}
            renderItem={(props: ListRenderItemInfo<any>) => {
              const {item} = props;
              return (
                <Box softShadow={'2'} p="$4" borderRadius="$lg" bg="$white">
                  <HStack space="md" alignItems="flex-start">
                    <Image
                      borderRadius={9999}
                      style={{width: 45, height: 45}}
                      source={AvatarPlaceholder}
                    />
                    <Box>
                      <VStack alignItems="flex-start">
                        <AirbnbRating
                          count={5}
                          showRating={false}
                          defaultRating={4}
                          size={24}
                        />
                        <Text color="$textDark500">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Aenean et ultrices nibh. Aenean sollicitudin
                          massa sit amet feugiat ornare. Praesent a sem sapien.
                          Vestibulum pharetra aliquam mauris ut auctor
                        </Text>
                      </VStack>
                    </Box>
                  </HStack>
                </Box>
              );
            }}
            ItemSeparatorComponent={() => {
              return (
                <Box
                  style={{
                    height: 15,
                    width: '100%',
                  }}
                />
              );
            }}
          />
          <HStack justifyContent="center">
            <BaseButton
              background="$primary500"
              isLoading={false}
              disabled={false}
              color="$white"
              title="Calificar"
              hasIcon={false}
              onPress={() => setOpen(true)}
            />
          </HStack>
        </Box>
      </Box>
      <ReviewModal show={open} onClose={() => setOpen(false)} barberId={id} />
    </>
  );
}
