import React, {useRef, useState} from 'react';
import {
  Button,
  Heading,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  Text,
  ButtonText,
  HStack,
} from '@gluestack-ui/themed';
import {RootState, useAppDispatch, useAppSelector} from '../../../store';
import {hideInfoModal} from '../../../store/features/layoutSlice';
import LottieView from 'lottie-react-native';
import BaseButton from '../baseButton';

const animations = {
  success: require('../../../assets/lottie/success.json'),
  info: require('../../../assets/lottie/info.json'),
  error: require('../../../assets/lottie/error.json'),
};

export default function InfoModal() {
  const dispatch = useAppDispatch();
  const {infoModal} = useAppSelector((state: RootState) => state.layout);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const handleClose = () => {
    dispatch(hideInfoModal());
  };

  const handleCancel = () => {
    if (infoModal?.cancelCb) {
      infoModal.cancelCb();
      handleClose();
    }
  };
  const handleSubmit = () => {
    if (infoModal?.submitCb) {
      infoModal.submitCb();
      if (infoModal.submitData.hasLoader) {
        setLoadingSubmit(true);
      }
    }
  };
  const handleAnimationEnd = () => {
    console.log('on animation end');
    if (infoModal?.hideOnAnimationEnd) {
      dispatch(hideInfoModal());
    }
  };
  return (
    <Modal isOpen={Boolean(infoModal)} bg="$primary100">
      <ModalBackdrop />
      <ModalContent bg="$white" p="$4">
        <ModalBody>
          <HStack justifyContent="center">
            <LottieView
              style={{width: 150, height: 150}}
              source={animations[infoModal?.type as keyof typeof animations]}
              onAnimationFinish={() => handleAnimationEnd()}
              autoPlay
              loop={false}
            />
          </HStack>
          <Text textAlign="center" color={'$textDark500'}>
            {infoModal?.title}
          </Text>
        </ModalBody>
        <ModalFooter>
          <HStack justifyContent="center" space="2xl" w="$full">
            {infoModal?.hasCancel && infoModal?.cancelData && (
              <Button
                variant="solid"
                size="sm"
                bg={infoModal?.cancelData?.background}
                onPress={handleCancel}>
                <ButtonText color={'$blueGray500'}>
                  {infoModal?.cancelData?.text}
                </ButtonText>
              </Button>
            )}
            {infoModal?.hasSubmit && infoModal?.submitData && (
              <BaseButton
                title={infoModal?.submitData?.text}
                bg={infoModal?.submitData?.background}
                color="$white"
                onPress={handleSubmit}
                disabled={loadingSubmit}
                hasIcon={false}
                isLoading={loadingSubmit}
              />
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
