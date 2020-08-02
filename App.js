import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, SafeAreaView, Modal, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { FontAwesome } from "@expo/vector-icons";

export default function App() {
  const canRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [capturedPhoto,setCapturedPhoto] = useState(null);
  const [open,setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>Sem acesso à câmera.</Text>;
  }

  async function takePicture(){
    if(canRef){
      const data = await canRef.current.takePictureAsync();
      setCapturedPhoto(data.uri);
      setOpen(true);
      console.log(data);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Camera 
        style={{ flex: 1 }} 
        type={type}
        ref={canRef}
        >
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{
              flex: 1,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={{ fontSize: 28, marginBottom: 10, color: 'white' }}>Mudar câmera</Text>
          </TouchableOpacity>
        </View>
      </Camera>
      
      <TouchableOpacity style={styles.button} onPress={takePicture}>
        <FontAwesome name="camera" size={23} color="#FFF"></FontAwesome>
      </TouchableOpacity>
      
      { capturedPhoto && 
        <Modal
          animationType='slide'
          transparent={false}
          visible={open}
        >
          <View style={{
                   flex: 1,
                   justifyContent: 'center',
                   alignItems: 'center',
                   magin: 20,
                   }}>

                     <TouchableOpacity style={{margin: 10}}
                                      onPress={ () => setOpen(false) }
                                      >
                      <FontAwesome name="window-close" 
                                   size={50}
                                   color="#F00000"
                                   />
                     </TouchableOpacity>
                   
                    <Image
                      style={{ width: '100%', height: 300, borderRadius: 20 }}
                      source={{ uri: capturedPhoto }}
                    />
                   
                   </View>
 
        </Modal>
      }

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    margin: 20,
    borderRadius: 10,
    height: 50, 
  }
})
