import {Avatar, Box, AvatarImage, HStack} from '@gluestack-ui/themed';
import {User} from '../../../types/user';
import CustomText from '../text';

interface Props {
  barber: User | null;
}

const BarberAvatar = ({barber}: Props) => {
  console.log("barber data", barber)
  return (
    <HStack alignItems='center' space="md">
        <Avatar>
          <AvatarImage source={{uri: barber?.avatar}} />
        </Avatar>
        <Box>
          <CustomText>
            {`${barber?.name} ${barber?.lastname}`}
          </CustomText>
        </Box>
    </HStack>
  );
};

export default BarberAvatar;
