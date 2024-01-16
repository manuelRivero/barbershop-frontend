import React, { useRef } from 'react';
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
  FlatList,
  Box,
  Pressable,
  VStack,
  HStack,
} from '@gluestack-ui/themed';
import { TurnSelectItem } from '../../../types/turns';
import { ListRenderItemInfo } from 'react-native';
import moment from 'moment';
import { useAppDispatch } from '../../../store';
import { showInfoModal } from '../../../store/features/layoutSlice';

interface Props {
  show: boolean;
  onClose: () => void;
  turns: TurnSelectItem[];
  onSelect: (e: TurnSelectItem) => Promise<any>;
  businessHoursEnd: moment.Moment
}

export default function SelectTurnModal({
  show,
  onClose,
  turns,
  onSelect,
  businessHoursEnd,
}: Props) {
  const dispatch = useAppDispatch();
  const ref = useRef();

  const handleSelect = (item: TurnSelectItem): void => {
    onSelect(item)

  };
  return (
    <Modal isOpen={show} onClose={onClose} finalFocusRef={ref}>
      <ModalBackdrop />
      <ModalContent maxHeight={500} pb="$6">
        <ModalHeader>
          <VStack w="$full">
            <HStack justifyContent='space-between'>
              <Heading size="lg" color="$textDark500">Turnos disponibles</Heading>
              <ModalCloseButton>
                <Icon as={CloseIcon} color="$textDark500" />
              </ModalCloseButton>

            </HStack>
            <Text mt="$2" textAlign="center" fontSize="$xl" color="$textDark500">{businessHoursEnd.format("DD-MM-yyyy")}</Text>

          </VStack>
        </ModalHeader>
        <ModalBody>

          <Box>
            <FlatList
              data={turns}
              ListEmptyComponent={() => (<Box>
                <Text color="$textDark500">No hay más turnos disponibles para hoy.</Text>
              </Box>)}
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
              renderItem={(props: ListRenderItemInfo<any>) => {
                const { item } = props;
                return (
                  <Pressable onPress={() => handleSelect(item)}>
                    <Box softShadow={'1'} p="$4" borderRadius="$lg" bg="$white">

                      <Text color="$textDark500">{moment.utc(item.startDate).format('hh:mm A')} - {moment.utc(item.endDate).format('hh:mm A')}</Text>
                    </Box>
                  </Pressable>
                );
              }}
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
