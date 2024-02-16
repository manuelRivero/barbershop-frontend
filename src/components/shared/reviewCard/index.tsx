import { VStack } from "@gluestack-ui/themed";
import { Text } from "@gluestack-ui/themed";
import { HStack } from "@gluestack-ui/themed";
import { Box } from "@gluestack-ui/themed";
import { AirbnbRating } from "react-native-ratings";
import { Image } from "@gluestack-ui/themed";
import { User } from "../../../types/user";
interface Props{
    item:{
        userData:[ User]
        score: number;
        comment: string
    }
}

export default function ReviewCard({item}:Props) {
  return (
    <Box hardShadow={'2'} p="$4" borderRadius="$lg" bg="$white">
    <HStack space="md" alignItems="flex-start">
      <Image
        borderRadius={9999}
        style={{width: 45, height: 45}}
        source={{uri: item.userData[0].avatar}}
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
          <Text color="$textDark500">{item.comment}</Text>
        </VStack>
      </Box>
    </HStack>
  </Box>
  )
}
