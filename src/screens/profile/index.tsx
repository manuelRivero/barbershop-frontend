import React, {useEffect, useState} from 'react';
import ProfileCard from '../../components/profile/profileCard';
import {
  Box,
  HStack,
  Text,
  VStack,
  Heading,
  ScrollView,
  Image,
} from '@gluestack-ui/themed';
import Clock from 'react-live-clock';
import BaseButton from '../../components/shared/baseButton';
import LinkButton from '../../components/shared/linkButton';
import {RootState, useAppDispatch, useAppSelector} from '../../store';
import {logout} from '../../store/features/authSlice';
import ProfileForm from '../../components/profile/profileForm';
import {Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import ReviewCard from '../../components/shared/reviewCard';
import {useGetReviewsQuery} from '../../api/reviewsApi';
import Loader from '../../components/shared/loader';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {useGetImagesQuery} from '../../api/galleryApi';
import {resetAllturns, resetUserTurn} from '../../store/features/turnsSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import socket from '../../socket';
import CustomHeading from '../../components/shared/heading';
import CustomText from '../../components/shared/text';
import Header from '../../components/header';

const {width} = Dimensions.get('window');

export default function Profile() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispacth = useAppDispatch();
  const {user} = useAppSelector((state: RootState) => state.auth);
  const [showModal, setShowModal] = useState<boolean>(false);

  const [activeSlideReview, setActiveSlideReview] = useState<number>(0);
  const [activeSlideGallery, setActiveSlideGallery] = useState<number>(0);

  const {data, isLoading, refetch} = useGetReviewsQuery(
    {barber: user ? user?._id : '', page: 1},
    {skip: user?.role === 'user' || user?.role === 'admin' ? true : false},
  );

  const {
    data: galleryData,
    isLoading: isLoadingGallery,
    refetch: refecthGallery,
  } = useGetImagesQuery(
    {},
    {skip: user?.role === 'user' || user?.role === 'admin' ? true : false},
  );
  const handleLogout = () => {
    dispacth(resetUserTurn());
    dispacth(resetAllturns());
    AsyncStorage.removeItem('persist:root');
    if (
      user?.role === 'barber' ||
      user?.role === 'admin-barber' ||
      user?.role === 'user'
    ) {
      socket.emit('remove-online-user', {user: {_id: user?._id}});
    }
    socket.close();
    socket.disconnect();
    dispacth(logout());
  };
  console.log('galleryData', galleryData);
  const handleProfileEdition = () => {};

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      refetch();
      refecthGallery();
    });

    return unsubscribe;
  }, [navigation]);

  if (isLoading || isLoadingGallery) {
    return <Loader />;
  }
  return (
    <LinearGradient
      style={{flex: 1}}
      colors={['#fff', '#f1e2ca']}
      start={{x: 0, y: 0.6}}
      end={{x: 0, y: 1}}>
      <ScrollView position="relative" flex={1}>
        <Header
          viewClock={true}
          viewGoBack={false}
          title={'Perfil'}
          width={width}
        />
        <Box p="$4" mt="$16">
          <ProfileCard data={user} />
        </Box>
        <HStack mt="$4" space="2xl" justifyContent="center">
          <LinkButton
            color="$primary500"
            title="Cerrar sesión"
            onPress={handleLogout}
            isLoading={false}
            disabled={false}
          />
          <BaseButton
            title="Editar perfil"
            background={'$primary500'}
            color={'$white'}
            onPress={() => setShowModal(true)}
            isLoading={false}
            disabled={false}
          />
        </HStack>
        {(user?.role === 'barber' || user?.role === 'admin-barber') && (
          <Box mt="$4" p="$4">
            <CustomHeading size="lg" color="$textDark500">
              Ultimas calificaciones
            </CustomHeading>
            <Carousel
              data={data ? data?.data : []}
              layout={'default'}
              loop={true}
              onSnapToItem={index => setActiveSlideReview(index)}
              renderItem={({item}) => {
                return (
                  <Box mt="$6" mb="$6">
                    <ReviewCard item={item} />
                  </Box>
                );
              }}
              sliderWidth={width}
              itemWidth={width * 0.8}
            />
            <Pagination
              dotStyle={{
                backgroundColor: '#367187',
              }}
              dotsLength={data ? data?.data.length : [].length}
              activeDotIndex={activeSlideReview}
            />
            {data?.data.length === 0 && (
              <CustomText>Aún no tienes ninguna calificación</CustomText>
            )}
          </Box>
        )}
        {(user?.role === 'barber' || user?.role === 'admin-barber') && (
          <Box mt="$4" p="$4">
            <CustomHeading size="lg" color="$textDark500" mb="$4">
              Galería{' '}
            </CustomHeading>
            <Carousel
              data={galleryData ? galleryData.data : []}
              layout={'default'}
              loop={true}
              onSnapToItem={index => setActiveSlideGallery(index)}
              renderItem={({item}) => {
                return (
                  <Image
                    borderRadius={16}
                    w={300}
                    h={300}
                    resizeMode="cover"
                    source={{uri: item.url}}
                    alt="imagen"
                  />
                );
              }}
              sliderWidth={width}
              itemWidth={width * 0.8}
            />
            <Box mb="$6">
              <Pagination
                dotStyle={{
                  backgroundColor: '#367187',
                }}
                dotsLength={data ? data?.data.length : [].length}
                activeDotIndex={activeSlideGallery}
              />

              {galleryData?.data.length === 0 && (
                <CustomText>Aún no tienes imagenes en tu galería</CustomText>
              )}
            </Box>
            <HStack mt="$4" space="2xl" justifyContent="center">
              <BaseButton
                title="Editar galería"
                background={'$primary500'}
                color={'$white'}
                onPress={() => navigation.navigate('BarberGallery')}
                isLoading={false}
                disabled={false}
              />
            </HStack>
          </Box>
        )}

        <ProfileForm show={showModal} onClose={() => setShowModal(false)} />
      </ScrollView>
    </LinearGradient>
  );
}
