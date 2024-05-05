import {Avatar, Box, AvatarImage, HStack} from '@gluestack-ui/themed';
import {User} from '../../../types/user';
import CustomHeading from '../heading';

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
          <CustomHeading fontWeight='bold'>
            {`${barber?.name} ${barber?.lastname}`}
          </CustomHeading>
        </Box>
    </HStack>
  );
};

export default BarberAvatar;
