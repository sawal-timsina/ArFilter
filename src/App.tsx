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
  Dimensions,
  Image,
  Linking,
  Platform,
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
import CameraChange from '~/assets/icons/cameraChange.svg';
import Carousel from 'react-native-snap-carousel';
import {Filter, FilterProps} from './interfaces/filter';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import CameraRoll from '@react-native-community/cameraroll';
import SimpleToast from 'react-native-simple-toast';
import {ProgressBar} from 'react-native-paper';

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
  const [latestImage, setLatestImage] = useState<string>('');
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

      cameraRef.current.takePictureAsync(options).then(data => {
        CameraRoll.save(data.uri, {type: 'photo'})
          .then(() => {
            SimpleToast.show('Saved to gallery!', 500);
          })
          .catch(err => {
            console.error('error', err);
          })
          .finally(() => {
            setIsTakingPicture(false);
          });
      });
    }
  };

  useEffect(() => {
    if (!isTakingPicture) {
      CameraRoll.getPhotos({
        first: 1,
        groupTypes: 'All',
        assetType: 'Photos',
      }).then(r => {
        setLatestImage(r.edges[0].node.image.uri);
      });
    }
  }, [isTakingPicture]);

  return (
    <SafeAreaView style={[backgroundStyle, styles.fullScreen]}>
      <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
      <View style={[styles.fullScreen]}>
        <RNCamera
          ref={cameraRef}
          onFacesDetected={response => {
            console.log(response.faces[0]?.bounds.origin);
          }}
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
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
      </View>
      <View
        style={[
          StyleSheet.absoluteFill,
          {flexDirection: 'column-reverse', backgroundColor: 'transparent'},
        ]}>
        <View style={[styles.bottomBar]}>
          <TouchableOpacity
            style={{
              overflow: 'hidden',
              margin: 6,
              borderWidth: 2,
              borderColor: 'white',
              borderRadius: 8,
              height: 32,
              width: 32,
            }}
            onPress={() => {
              Linking.openURL(
                Platform.select({
                  android: 'content://media/internal/images/media',
                  ios: 'photos-redirect://',
                }) || '',
              );
            }}>
            {latestImage ? (
              <Image
                source={{uri: latestImage}}
                style={{width: '100%', height: '100%'}}
              />
            ) : (
              <ProgressBar style={{width: '100%', height: '100%'}} />
            )}
          </TouchableOpacity>

          <View style={[styles.filterDetails]}>
            <TouchableOpacity style={{padding: 8}} onPress={() => {}}>
              <Icon name="bookmark" size={20} color="#aaa" />
            </TouchableOpacity>

            <View style={{alignItems: 'center', flex: 1}}>
              <Text style={{color: '#aaa'}}>
                {filters[currentFilter].title}
              </Text>
              <Text style={{color: '#aaa'}}>
                {filters[currentFilter].title}
              </Text>
            </View>

            <TouchableOpacity style={{padding: 8}} onPress={() => {}}>
              <Icon name="close" size={20} color="#aaa" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{padding: 8}}
            onPress={() => setIsFront(f => !f)}>
            <CameraChange width={28} height={28} fill={'#fff'} />
          </TouchableOpacity>
        </View>
        <View style={{paddingBottom: 16, backgroundColor: 'transparent'}}>
          <Carousel
            ref={courRef}
            itemWidth={70}
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
    height: 70,
    width: 70,
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
  bottomBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  filterDetails: {
    alignSelf: 'center',
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(100,100,100,0.5)',
    marginLeft: 16,
    marginRight: 16,
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default App;
