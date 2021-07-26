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
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {RNCamera} from 'react-native-camera';
import {Filter} from './interfaces/filter';
import CameraRoll from '@react-native-community/cameraroll';
import SimpleToast from 'react-native-simple-toast';
import {Filters} from './components/molecules';
import {CameraControls} from './components';

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
  const [currentFilter, setCurrentFilter] = useState<Filter>(filters[0]);
  const cameraRef = useRef<RNCamera>(null);

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
            const bounds = response.faces[0]?.bounds.origin;
            bounds && console.log(bounds);
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
        <CameraControls
          latestImage={latestImage}
          switchCamera={() => setIsFront(f => !f)}
          currentFilter={currentFilter}
        />
        <Filters
          filters={filters}
          setCurrentFilter={index => {
            setCurrentFilter(filters[index]);
          }}
          takePicture={takePicture}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    width: '100%',
    flex: 1,
  },
  ring: {
    borderWidth: 4,
    borderColor: 'white',
  },
});

export default App;
