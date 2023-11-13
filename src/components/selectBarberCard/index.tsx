import { Image } from "@gluestack-ui/themed";
import { Text } from "@gluestack-ui/themed";
import { Box, HStack } from "@gluestack-ui/themed";
import React from "react";
import { User } from "../../types/user";

interface Props {
    data: User
}

export default function SelectBarberCard({ data }: Props) {
    return (
        <Box softShadow={'1'} p="$4" borderRadius="$lg" bg="$white">
          <HStack space="lg" mb={'$4'}>
            <Image
              style={{width: 100, height: 100}}
              borderRadius={10}
              resizeMode={'cover'}
              source={{
                uri: data.image,
                headers: {
                  Pragma: 'no-cache',
                },
              }}
              alt="foto-del-servicio"
              onError={({ nativeEvent: {error} }) => console.log(error)}
            />
            
            <Box>
              <Text fontWeight="bold" color="$textDark500">
                {data.name} {data.lastname}
              </Text>
            </Box>
          </HStack>
        </Box>
      );
}