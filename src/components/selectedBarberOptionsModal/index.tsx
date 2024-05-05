import {
  Button,
  Heading,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Icon,
  Text,
  CloseIcon,
  ButtonText,
  Box,
  Pressable,
} from '@gluestack-ui/themed';
import React, {useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { User } from '../../types/user';
import { useBarberDisableMutation } from '../../api/barbersApi';
import BarberAvatar from '../shared/barberAvatar';


interface Props {
  show: boolean;
  onClose: () => void;
  barberData: User | null
}
export default function SelectBarberOptionsModal({
  show,
  onClose,
  barberData
}: Props) {
  const ref = useRef();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();


  const handleReview = () => {
    navigation.navigate("UserBarberReview",{id:barberData?._id})
    onClose()
  }
  const handleGallery = () => {
    navigation.navigate("UserBarberGallery",{id:barberData?._id})
    onClose()

  }
  const handleReservation = () => {
    navigation.navigate('UserServiceSelection', {
      id: barberData?._id,
    })
    onClose()

  }
  return (
    <Modal
      isOpen={show && Boolean(barberData)}
      onClose={onClose}
      finalFocusRef={ref}
      >
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="lg"></Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Box mb={"$4"}>
          <BarberAvatar barber={barberData} />
          </Box>
          <Pressable onPress={handleGallery}>
            <Box
              softShadow={'2'}
              mb="$3"
              p="$4"
              borderRadius="$lg"
              bg="$white">
              <Text color="$textDark900">Ver catalogo de cortes</Text>
            </Box>
          </Pressable>
          <Pressable onPress={handleReview}>
            <Box
              softShadow={'2'}
              mb="$3"
              p="$4"
              borderRadius="$lg"
              bg="$white">
              <Text color="$textDark900">Ver calificaciones</Text>
            </Box>
          </Pressable>
          <Pressable onPress={handleReservation}>
            <Box
              softShadow={'2'}
              mb="$3"
              p="$4"
              borderRadius="$lg"
              bg="$white">
              <Text color="$textDark900">Agendar turno</Text>
            </Box>
          </Pressable>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
