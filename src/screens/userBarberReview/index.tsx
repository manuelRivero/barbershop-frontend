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
import {useGetReviewsQuery} from '../../api/reviewsApi';
import Loader from '../../components/shared/loader';
import {User} from '../../types/user';
import LinearGradient from 'react-native-linear-gradient';
import {Dimensions} from 'react-native';

interface Review {
  comment: string;
  score: string;
  user: User;
  barber: User;
  createdAt: string;
}
const {width} = Dimensions.get('window');

export default function UserBarberReview({route}: any) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {id} = route.params;
  const [page, setPage] = useState<number>(1);
  const {data, isLoading, refetch} = useGetReviewsQuery({barber: id, page});
  const [open, setOpen] = useState<boolean>(false);

  console.log('data', data);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <LinearGradient
      style={{flex: 1}}
      colors={['#fff', '#f1e2ca']}
      start={{x: 0, y: 0.6}}
      end={{x: 0, y: 1}}>
      <Box flex={1} position="relative">
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
            Calificaciones
          </Heading>
          <Box p="$6"></Box>
        </HStack>
        <Box mt="$10">
          <FlatList
            contentContainerStyle={{padding: 16, paddingBottom: 24}}
            data={data?.data}
            onEndReached={() => {
              if (data && data?.metadata.totalPages > page) {
                setPage(prevState => prevState + 1);
              }
            }}
            renderItem={(props: ListRenderItemInfo<any>) => {
              const {item} = props;
              return (
                <Box softShadow={'2'} p="$4" borderRadius="$lg" bg="$white">
                  <HStack space="md" alignItems="flex-start">
                    <Image
                      borderRadius={9999}
                      style={{width: 45, height: 45}}
                      source={{uri: item.userData[0].avatar}}
                    />
                    <Box>
                      <VStack alignItems="flex-start">
                        <AirbnbRating
                          count={5}
                          showRating={false}
                          defaultRating={item.score | 0}
                          size={24}
                          isDisabled={true}
                        />
                        <Text color="$textDark500">{item.comment}</Text>
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
      <ReviewModal
        show={open}
        onClose={() => {
          setOpen(false);
          refetch();
        }}
        barberId={id}
      />
    </LinearGradient>
  );
}
