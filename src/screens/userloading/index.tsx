import React, {useEffect} from 'react';
import Loader from '../../components/shared/loader';
import {useAppDispatch} from '../../store';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HStack, VStack} from '@gluestack-ui/themed';
import {
  PERMISSIONS,
  check,
  request,
  openSettings,
  RESULTS,
} from 'react-native-permissions';
import {showInfoModal} from '../../store/features/layoutSlice';
import {Platform} from 'react-native';

export default function UserLoading() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();

  const requestNotificationPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };

  const checkNotificationPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };

  useEffect(() => {}, []);

  useEffect(() => {
    const chechForPermissions = async () => {
      const platform = Platform.Version;
      if (parseInt(`${platform}`) >= 33) {
        const hasPermissions = await checkNotificationPermission();
        if (hasPermissions !== RESULTS.GRANTED) {
          dispatch(
            showInfoModal({
              title: '¡Necesitamos permisos para enviarte notificaciones! versión de android :' + platform,
              type: 'info',
              hasCancel: false,
              cancelCb: null,
              hasSubmit: true,
              submitCb: async () => {
                const permissionRequest = await requestNotificationPermission();
                if (permissionRequest !== RESULTS.GRANTED) {
                  dispatch(
                    showInfoModal({
                      title:
                        'Ve a configuración y activa las notificaciones para poder continuar',
                      type: 'error',
                      hasCancel: false,
                      cancelCb: null,
                      hasSubmit: true,
                      submitCb: async () => {
                        openSettings();
                      },
                      hideOnAnimationEnd: false,
                      submitData: {
                        text: 'Ir a configuración',
                        background: '$primary500',
                      },
                    }),
                  );
                } else {
                  dispatch(showInfoModal(null));
                  navigation.navigate('UserRoutes');
                }
              },
              hideOnAnimationEnd: false,
              submitData: {
                text: 'Dar permisos',
                background: '$primary500',
              },
            }),
          );
        } else {
          dispatch(showInfoModal(null));
          navigation.navigate('UserRoutes');
        }
      } else {
        dispatch(showInfoModal(null));
        navigation.navigate('UserRoutes');
      }
    };
    chechForPermissions();
  }, []);

  return (
    <HStack justifyContent="center" alignItems="center" flex={1} w={'$full'}>
      <VStack justifyContent="center" alignItems="center" flex={1} w={'$full'}>
        <Loader />
      </VStack>
    </HStack>
  );
}
