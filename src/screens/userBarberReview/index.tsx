import {FlatList, Image, VStack} from '@gluestack-ui/themed';
import {Box, HStack, Icon, Pressable} from '@gluestack-ui/themed';
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
import CustomHeading from '../../components/shared/heading';
import CustomText from '../../components/shared/text';
import Header from '../../components/header';
import BarberAvatar from '../../components/shared/barberAvatar';
import { useGetBarberDetailQuery } from '../../api/barbersApi';

interface Review {
  comment: string;
  score: string;
  user: User;
  barber: User;
  createdAt: string;
}
const {width, height} = Dimensions.get('window');

export default function UserBarberReview({route}: any) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {id} = route.params;
  const [page, setPage] = useState<number>(1);
  const {data, isLoading, refetch} = useGetReviewsQuery({barber: id, page});
  const {data:barberData, isLoading:isLoadingBarberData, refetch: refetchBarberData} = useGetBarberDetailQuery({id})

  const [open, setOpen] = useState<boolean>(false);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation]);

  if (isLoading || isLoadingBarberData) {
    return <Loader />;
  }
  return (
    <LinearGradient
      style={{flex: 1}}
      colors={['#fff', '#f1e2ca']}
      start={{x: 0, y: 0.6}}
      end={{x: 0, y: 1}}>
      <Box flex={1} position="relative">
        <Header
          title={'Calificaciones'}
          viewClock={false}
          viewGoBack={true}
          width={width}
        />
        <Box mt="$16"  position="relative" flex={1}>
          <Box p="$4">
          <BarberAvatar barber={barberData?.barber[0] || null} />

          </Box>
          <FlatList
            contentContainerStyle={{padding: 16}}
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
                      source={
                        item.userData[0].avatar
                          ? {uri: item.userData[0].avatar}
                          : require('./../../assets/images/avatar-placeholder.jpeg')
                      }
                      alt="User review image"
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
                        <CustomText color="$textDark500">
                          {item.userData[0].name}
                        </CustomText>
                        <CustomText color="$textDark500">
                          {item.comment}
                        </CustomText>
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
          <HStack justifyContent="center" mt={'$4'}>
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
