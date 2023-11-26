import React, {useEffect} from 'react';
import Loader from '../../components/shared/loader';
import {RootState, useAppDispatch, useAppSelector} from '../../store';
import {useGetServicesQuery} from '../../api/servicesApi';
import {addAllServices} from '../../store/features/servicesSlice';
import {Box} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {VStack} from '@gluestack-ui/themed';
import {PERMISSIONS, check, request, openSettings} from 'react-native-permissions';
import {showInfoModal} from '../../store/features/layoutSlice';


export default function Loading() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {user} = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const {data, isLoading} = useGetServicesQuery();

  const requestNotificationPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };

  const checkNotificationPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };

  useEffect(() => {
    if (data) {
      dispatch(addAllServices(data.services));
    }
  }, [data]);

  useEffect(() => {
    dispatch(
      showInfoModal({
        title: '¡Necesitamos permisos para enviarte notificaciones!',
        type: 'success',
        hasCancel: false,
        cancelCb: null,
        hasSubmit: true,
        submitCb: async () => {
          const hasPermissions = await checkNotificationPermission();
          if (!hasPermissions) {
            const permissionRequest = await requestNotificationPermission();
            if (!permissionRequest) {
              dispatch(
                showInfoModal({
                  title: 'Ve a configuración y activa las notificaciones para poder continuar',
                  type: 'success',
                  hasCancel: false,
                  cancelCb: null,
                  hasSubmit: true,
                  submitCb: async () => {
                        openSettings();
                  },
                  hideOnAnimationEnd: false,
                }),
              );
            }
          } else {
            navigation.navigate('BottomsTabs');
          }
        },
        hideOnAnimationEnd: false,
      }),
    );
  }, []);

  return (
    <VStack justifyContent="center" alignItems="center" flex={1}>
      <Loader />
    </VStack>
  );
}
