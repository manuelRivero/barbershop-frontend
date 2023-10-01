import React, {useRef} from 'react';
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
} from '@gluestack-ui/themed';
import {TurnSelectItem} from '../../types/turns';
import {ListRenderItemInfo} from 'react-native';
import moment from 'moment';

interface Props {
  show: boolean;
  onClose: () => void;
  turns: TurnSelectItem[];
  onSelect : (e:TurnSelectItem) => void
}

export default function SelectTurnModal({show, onClose, turns, onSelect}: Props) {
  const ref = useRef();

  return (
    <Modal isOpen={show} onClose={onClose} finalFocusRef={ref}>
      <ModalBackdrop />
      <ModalContent maxHeight={'$3/5'}>
        <ModalHeader>
          <Heading size="lg">Turnos disponibles</Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>
        <Box p="$4">
          <FlatList
            data={turns}
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
              const {item} = props;
              return (
                <Pressable onPress={()=> onSelect(item)}>
                <Box softShadow={'1'} p="$4" borderRadius="$lg" bg="$white">
                  <Text>{moment(item.startDate).format('hh:mm')}</Text>
                </Box>

                </Pressable>
              );
            }}
          />
        </Box>
      </ModalContent>
    </Modal>
  );
}
