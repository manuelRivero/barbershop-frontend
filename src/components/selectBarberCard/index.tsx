import {Icon, Image, VStack} from '@gluestack-ui/themed';
import {Text} from '@gluestack-ui/themed';
import {Box, HStack} from '@gluestack-ui/themed';
import React, {useState} from 'react';
import {User} from '../../types/user';
import {Rating, AirbnbRating} from 'react-native-ratings';
import {Pressable} from '@gluestack-ui/themed';
import {MoreVertical} from 'lucide-react-native';
import BaseButton from '../shared/baseButton';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import ImageModal from '../imageModal';
interface Props {
  data: User;
  selectBarber: any;
}

export default function SelectBarberCard({data, selectBarber}: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [show, setShow] = useState<boolean>(false);

  return (
    <Box
      softShadow={'1'}
      p="$4"
      borderRadius="$lg"
      bg="$white"
      w="$full"
      maxWidth={400}>
      <HStack space="lg">
        {data.avatar && (
          <ImageModal
            show={show}
            onClose={() => setShow(false)}
            images={[data.avatar]}
          />
        )}
        <Pressable onPress={() => setShow(true)}>
          <Image
            softShadow="3"
            style={{width: 100, height: 100}}
            borderRadius={10}
            resizeMode={'cover'}
            source={
              data.avatar
                ? {uri: data.avatar}
                : require('./../../assets/images/avatar-placeholder.jpeg')
            }
            alt="foto-del-barbero"
            onError={({nativeEvent: {error}}) => console.log(error)}
          />
        </Pressable>

        <VStack flex={1}>
          <Text fontWeight="bold" color="$textDark500">
            {data.name} {data.lastname}
          </Text>
          <HStack>
            <AirbnbRating
              count={5}
              showRating={false}
              defaultRating={Math.ceil(data.score || 0)}
              size={24}
              isDisabled={true}
            />
          </HStack>
          <VStack
            w="$full"
            mt="$4"
            flex={1}
            justifyContent="flex-end"
            alignItems="flex-end">
            <HStack
              space="lg"
              alignItems="center"
              justifyContent="flex-end"
              w="$full">
              {/* <Pressable>
                <Text fontWeight="bold" color="$textDark500">
                  Ver cortes
                </Text>
              </Pressable> */}
              <BaseButton
                background="$primary500"
                color="$white"
                onPress={selectBarber}
                title="Seleccionar"
                hasIcon={false}
                disabled={false}
                isLoading={false}
              />
            </HStack>
          </VStack>
        </VStack>
      </HStack>
    </Box>
  );
}
