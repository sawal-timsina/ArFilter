/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {RNCamera} from 'react-native-camera';
import {Button} from 'react-native-paper';
// import CameraChange from '../assets/icons/cameraChange.svg';
import Carousel from 'react-native-snap-carousel';
import {Filter, FilterProps} from './interfaces/filter';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [filters] = useState<Filter[]>([
    {title: 'home', background: 'white'},
    {title: 'f1', background: 'yellow'},
    {title: 'f2', background: 'green'},
    {title: 'f3', background: 'red'},
  ]);
  const [isFront, setIsFront] = useState<boolean>(true);
  const [isTakingPicture, setIsTakingPicture] = useState<boolean>(false);
  const [isAudio] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<number>(0);
  const cameraRef = useRef<RNCamera>(null);
  const courRef = useRef<Carousel<Filter>>(null);

  const takePicture = async () => {
    if (cameraRef.current && !isTakingPicture) {
      let options = {
        quality: 1,
        fixOrientation: true,
        forceUpOrientation: true,
      };

      setIsTakingPicture(true);

      try {
        const data = await cameraRef.current.takePictureAsync(options);
        Alert.alert('Success', JSON.stringify(data));
      } catch (err) {
        Alert.alert('Error', 'Failed to take picture: ' + (err.message || err));
        return;
      } finally {
        setIsTakingPicture(false);
      }
    }
  };

  useEffect(() => {
    console.log(currentFilter);
  }, [currentFilter]);

  return (
    <SafeAreaView style={[backgroundStyle, styles.fullScreen]}>
      <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
      <View style={[styles.fullScreen]}>
        <RNCamera
          ref={cameraRef}
          captureAudio={isAudio}
          style={[styles.fullScreen]}
          type={
            !isFront
              ? RNCamera.Constants.Type.back
              : RNCamera.Constants.Type.front
          }
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
      </View>
      <View style={[StyleSheet.absoluteFill]}>
        <View style={[styles.fullScreen, {backgroundColor: 'transparent'}]}>
          <Button mode={'text'} onPress={() => setIsFront(f => !f)}>
            {/*<CameraChange fill={'#faf'} />*/}
            as
          </Button>
        </View>

        <View style={{marginBottom: 20}}>
          <Carousel
            ref={courRef}
            itemWidth={75}
            sliderHeight={84}
            layout={'default'}
            inactiveSlideScale={0.8}
            inactiveSlideOpacity={1}
            slideStyle={[styles.circle]}
            activeAnimationType={'decay'}
            onSnapToItem={setCurrentFilter}
            sliderWidth={Dimensions.get('screen').width}
            data={filters}
            renderItem={({item, index}: FilterProps) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={takePicture}
                  disabled={index !== currentFilter}>
                  <View
                    style={[
                      styles.filterCard,
                      styles.circle,
                      styles.offRing,
                      {backgroundColor: item.background},
                    ]}>
                    {!index && !currentFilter ? (
                      <Text />
                    ) : (
                      <Text>{item.title}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
          <View
            style={[
              StyleSheet.absoluteFill,
              styles.filterCard,
              {width: '100%', height: '100%'},
            ]}
            pointerEvents={'none'}>
            <View style={[styles.filterCard, styles.circle, styles.ring]} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    width: '100%',
    flex: 1,
  },
  circle: {
    borderRadius: 40,
    height: 75,
    width: 75,
  },
  filterCard: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    borderWidth: 4,
    borderColor: 'white',
  },
  offRing: {borderWidth: 6, borderColor: 'transparent'},
});

export default App;
