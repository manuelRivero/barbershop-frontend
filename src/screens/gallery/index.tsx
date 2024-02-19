import React, {useState} from 'react';
import ProfileCard from '../../components/profile/profileCard';
import {
  Box,
  HStack,
  Text,
  VStack,
  Heading,
  ScrollView,
  Image,
  FlatList,
  Icon,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Modal,
  CloseIcon,
} from '@gluestack-ui/themed';
import {RootState, useAppDispatch, useAppSelector} from '../../store';
import {Dimensions, ListRenderItemInfo, Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../components/shared/loader';
import {X} from 'lucide-react-native';
import {
  useCreateImageMutation,
  useDeleteImageMutation,
  useGetImagesQuery,
} from '../../api/galleryApi';
import {Pressable} from '@gluestack-ui/themed';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {ChevronLeftIcon} from 'lucide-react-native';
import BaseButton from '../../components/shared/baseButton';
import {ModalBody} from '@gluestack-ui/themed';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import LinkButton from '../../components/shared/linkButton';
import {ModalFooter} from '@gluestack-ui/themed';
import {showInfoModal} from '../../store/features/layoutSlice';

const {width} = Dimensions.get('window');

export default function Gallery() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [createImage, {isLoading: isLoadingCreateImage}] =
    useCreateImageMutation();
  const [deleteImage, {isLoading: isLoadingDeleteImage}] =
    useDeleteImageMutation();
  const dispacth = useAppDispatch();
  const {user} = useAppSelector((state: RootState) => state.auth);
  const {data, isLoading, refetch} = useGetImagesQuery({});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [imageBlob, setImageBlob] = useState<Asset | null>(null);
  const [image, setImage] = useState<null | {uri: string | undefined}>(null);

  
  const handleGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
    });
    console.log('resultado', result);
    
    if (result.assets) {
      console.log('result.assets[0].uri', result.assets[0].uri);
      setImage({uri: result.assets[0].uri});
      setImageBlob(result.assets[0]);
    }
  };

  const submit = async () => {
    const form = new FormData();
    form.append('image', {
      uri: Platform.select({
        ios: imageBlob?.uri?.replace('file://', ''),
        android: imageBlob?.uri,
      }),
      type: imageBlob?.type,
      name: imageBlob?.fileName,
    });

    console.log('else case');
    try {
      const response = await createImage(form).unwrap();
      console.log('response', response);
      dispacth(
        showInfoModal({
          title: '¡Imagen guardada!',
          type: 'success',
          hasCancel: false,
          cancelCb: null,
          hasSubmit: false,
          submitCb: null,
          hideOnAnimationEnd: true,
        }),
      );
      setImage(null);
      refetch();
      setShowModal(false);
    } catch (error) {
      console.log('error al guardar la imagen', error);
    }
  };

  const handleDelete = async (id: number, publicId: string) => {
    try {
      const response = await deleteImage({id, publicId});
      refetch();
      dispacth(
        showInfoModal({
          title: '¡Imagen eliminada!',
          type: 'success',
          hasCancel: false,
          cancelCb: null,
          hasSubmit: false,
          submitCb: null,
          hideOnAnimationEnd: true,
        }),
      );
    } catch (error) {}
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation]);

  if ((isLoading && !data) || isLoadingDeleteImage) {
    return <Loader />;
  }
  return (
    <LinearGradient
      style={{flex: 1}}
      colors={['#fff', '#f1e2ca']}
      start={{x: 0, y: 0.6}}
      end={{x: 0, y: 1}}>
      <Box position="relative" flex={1}>
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
        <HStack justifyContent="space-between" alignItems="center">
          <Pressable onPress={() => navigation.goBack()} p={'$4'}>
            <Icon as={ChevronLeftIcon} size={24} color="$textDark500" />
          </Pressable>
          <Heading textAlign="center" color="$textDark500">
            Galeria
          </Heading>
          <Box p="$6"></Box>
        </HStack>
        {data && data.data.length > 0 && (
          <FlatList
            ItemSeparatorComponent={() => (
              <Box style={{width: 20, height: 20}} />
            )} // add this line
            mt="$20"
            columnWrapperStyle={{justifyContent: 'center', gap: 20}}
            contentContainerStyle={{paddingBottom: 50}}
            data={data?.data}
            numColumns={2}
            columnGap={100}
            rowGap={100}
            renderItem={(props: ListRenderItemInfo<any>) => {
              const {item} = props;
              console.log('item', item);
              return (
                <Box
                  hardShadow={'1'}
                  w="auto"
                  bg="$black"
                  h="auto"
                  position="relative"
                  borderRadius={'$xl'}
                  overflow="hidden">
                  <Box
                    bg="$red500"
                    w="auto"
                    top={5}
                    right={5}
                    zIndex={2}
                    position="absolute"
                    p="$2"
                    borderRadius={'$3xl'}>
                    <Pressable
                      onPress={() => handleDelete(item._id, item.publicId)}>
                      <Icon as={X} size={20} alt="Eliminar" color="$white" />
                    </Pressable>
                  </Box>
                  <Image
                    w={150}
                    h={150}
                    source={{uri: item.url}}
                    alt="imagen de la galería"
                  />
                </Box>
              );
            }}
          />
        )}
        {data && data?.data.length === 0 && (
          <Box p="$4">
            <Text mt="$16" textAlign="center" color="$textDark500">
              Aún no has subido ninguna foto a tu galería
            </Text>
          </Box>
        )}
        {data && data?.data.length < 10 && (
          <HStack mt="$4" space="2xl" justifyContent="center">
            <BaseButton
              title="Agregar foto"
              background={'$primary500'}
              color={'$white'}
              onPress={() => setShowModal(true)}
              isLoading={false}
              disabled={false}
            />
          </HStack>
        )}
      </Box>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setImage(null);
          setImageBlob(null);
        }}
        bg="$primary100">
        <ModalBackdrop />
        <ModalContent bg="$white">
          <ModalHeader>
            <Heading size="lg" color="$textDark900">
              Subir foto
            </Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <HStack mt={'$2'} justifyContent="center">
              <Pressable onPress={handleGallery}>
                <Image
                  borderRadius={8}
                  style={{width: 200, height: 200}}
                  resizeMode="cover"
                  source={
                    image
                      ? image
                      : require('../../assets/images/image-placeholder.png')
                  }
                  alt="imagen-de-servicio"
                />
              </Pressable>
            </HStack>
            <HStack mt={'$2'} width={'100%'} justifyContent="center">
              <LinkButton
                title="Seleccionar imagen"
                color="$primary500"
                onPress={handleGallery}
                isLoading={false}
                disabled={isLoadingCreateImage}
                hasIcon={false}
              />
            </HStack>
          </ModalBody>
          <ModalFooter>
            {image && (
              <HStack mt={'$2'} width={'100%'} justifyContent="center">
                <BaseButton
                  title={'Guardar'}
                  background={'$primary500'}
                  color={'$white'}
                  onPress={submit}
                  isLoading={isLoadingCreateImage}
                  disabled={isLoadingCreateImage}
                  hasIcon={false}
                />
              </HStack>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </LinearGradient>
  );
}
