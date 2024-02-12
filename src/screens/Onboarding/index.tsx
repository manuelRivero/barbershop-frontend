import { Text, Image, Heading, Icon } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react'
import Onboarding from 'react-native-onboarding-swiper';

export default function WelcomeOnboarding() {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    return (
        <Onboarding
            onDone={() => navigation.navigate("UserRoutes", { screen: "Schedule" })}
            onSkip={() => navigation.navigate("UserRoutes", { screen: "Schedule" })}
            skipLabel={"Saltar"}
            nextLabel={"Siguiente"}
            bottomBarColor='#f1e2ca'
            pages={[
                {
                    backgroundColor: '#f1e2ca',
                    image: <Image w={200} h={200} resizeMode='contain' source={require('../../assets/images/logo-round.png')} />,
                    title: <Heading color="$textDark500">Encuentra a tu barbero</Heading>,
                    subtitle: <Text color="$textDark500">Selecciona a tu barbero de preferencia.</Text>,
                },
                {
                    backgroundColor: '#f1e2ca',
                    image: <Image w={200} h={200} resizeMode='contain' source={require('../../assets/images/logo-round.png')} />,
                    title: <Heading color="$textDark500">Explora los servicios</Heading>,
                    subtitle: <Text color="$textDark500">Elige el tipo de servicio que deseas.</Text>,
                },
                {
                    backgroundColor: '#f1e2ca',
                    image: <Image w={200} h={200} resizeMode='contain' source={require('../../assets/images/logo-round.png')} />,
                    title: <Heading color="$textDark500">Agenda tu turno</Heading>,
                    subtitle: <Text color="$textDark500">Escoge el horario para tu turno y listo.</Text>,
                },
            ]}
        />
    )
}
