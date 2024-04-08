import {ModalCloseButton} from '@gluestack-ui/themed';
import {ModalHeader} from '@gluestack-ui/themed';
import {Modal} from '@gluestack-ui/themed';
import {ModalContent} from '@gluestack-ui/themed';
import {ModalBackdrop} from '@gluestack-ui/themed';
import {Service} from '../../types/services';
import {Icon, CloseIcon} from '@gluestack-ui/themed';
import {ModalBody} from '@gluestack-ui/themed';
import {Image} from '@gluestack-ui/themed';
import CustomHeading from '../shared/heading';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import {Box} from '@gluestack-ui/themed';
import {useState} from 'react';
import {Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

interface Props {
  show: boolean;
  onClose: () => void;
  service: Service;
}
const ServiceImageModal = ({show, onClose, service}: Props) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);

  return (
    <Modal
      isOpen={show}
      onClose={() => {
        onClose();
      }}>
      <ModalBackdrop />
      <ModalContent bg="$white" maxHeight={'$3/4'}>
        <ModalHeader>
          <CustomHeading>Imágenes del servicio</CustomHeading>
          <ModalCloseButton>
            <Icon color="$textDark500" as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Carousel
            data={service.images}
            layout={'default'}
            onSnapToItem={index => setActiveSlide(index)}
            renderItem={({item, index}) => {
              console.log('index', index);
              return (
                <Box>
                  <Image
                    borderRadius={8}
                    style={{width: 295, height: 295}}
                    resizeMode="cover"
                    source={{uri: item.url}}
                    alt="imagen-de-servicio"
                  />
                </Box>
              );
            }}
            sliderWidth={width}
            itemWidth={width}
          />
          <Pagination
            dotStyle={{
              backgroundColor: '#367187',
            }}
            dotsLength={service.images.length}
            activeDotIndex={activeSlide}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ServiceImageModal;
