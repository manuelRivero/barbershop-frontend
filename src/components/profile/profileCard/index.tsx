import {
  Text,
  Box,
  Image,
  VStack,
  Pressable,
  Icon,
  HStack,
} from '@gluestack-ui/themed';
import React, { useState } from 'react';
import { User } from '../../../types/user';
import { Settings } from 'lucide-react-native';
import SettingsModal from '../settingsModal';

interface Props {
  data: User | null;
}

export default function rofiProfileCard({ data }: Props) {
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  if (!data) return null;
  return (
    <>
      <Box p="$4" hardShadow="1" borderRadius={10} bg="$white">
        <VStack space="md" alignItems="center">
          <HStack justifyContent='flex-end' flexGrow={1} w="$full">
          </HStack>
          <Box
            hardShadow="1"
            bg="$white"
            borderRadius={9999}
            style={{ width: 100, height: 100 }}>

            <Image
              borderRadius={9999}
              style={{ width: 100, height: 100 }}
              source={data.avatar ? { uri: data.avatar } : require("./../../../assets/images/avatar-placeholder.jpeg")}
            />
          </Box>
          <Box>
            <Text
              color="$textDark500"
              textAlign="center">{`${data.name} ${data.lastname}`}</Text>
            <Text color="$textDark500" textAlign="center">{`${data.email}`}</Text>
            {data.role === "user" && <>
              {data.phone?.length && data.phone?.length > 0 ? <Text color="$textDark500" textAlign="center">{`Teléfono: ${data.phone}`}</Text>
                : (<Box position='relative'>
                  <Text
                    color="$textDark500"
                    textAlign="center">Edita tu perfil y agrega tu número de WhatsApp</Text>
                  <Box position='absolute' width={10} height={10} bg='red' right={-5} top={-5} borderRadius={9999} />
                </Box>)}
            </>}

          </Box>
        </VStack>
      </Box>
      <SettingsModal show={showSettingsModal} onClose={() => setShowSettingsModal(false)} />

    </>
  );
}
