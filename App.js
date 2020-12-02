import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'

import useInterval from 'react-useinterval'
// import { Badge, Provider as PaperProvider } from 'react-native-paper'

import { calculateDistance } from './testDisdacnt'

const { width, height } = Dimensions.get('window')

const ASPECT_RATIO = width / height
const LATITUDE = 13.8293156
const LONGITUDE = 100.5292102
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
let id = 0

function randomColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`
}
export default function App() {
  const [state, setState] = React.useState({
    markers: [],
  },
  )
  const [region, setRegion] = React.useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  })
  const [permis, setPermis] = React.useState({ geo: false })
  const [gps, setGps] = React.useState(false)
  const [location, setLocation] = React.useState(false)
  const onMapPress = (e) => {
    // console.log(e?.nativeEvent)
    setGps(true)
    setState({
      markers: [
        ...state.markers,
        {
          coordinate: e.nativeEvent.coordinate,
          key: id++,
          color: randomColor(),
          description: `lantitude: ${e.nativeEvent.coordinate.latitude} longitude: ${e.nativeEvent.coordinate.longitude}`,
        },
      ],
    })
  }
  React.useEffect(
    () => {
      // console.log('in Funtion Effect')
      // console.log('geo', navigator?.geolocation)
      // if (!permis?.geo) {
      navigator?.permissions?.query({ name: 'geolocation' })?.then((result) => {
        // console.log(result)
        if (result.state === 'granted') {
          // console.log(result)
          setPermis({ geo: true })
        } else if (result.state === 'prompt') {
          // console.log(result)
          setPermis({ geo: true })
        } else {
          // console.log(result)
          setPermis({ geo: false })
        }
      })
      // }
    }, [permis, permis?.geo],
  )
  // React.useEffect(() => {
  //   // console.log('44444', imageWidth);
  //   if (fetc) {
  //     console.log(fetc);
  // navigator.geolocation.getCurrentPosition(
  //   position => {
  //     fetchWeather(position.coords.latitude, position.coords.longitude);
  //   },
  //   error => {
  //     setState({
  //       temperature: null,
  //       isLoading: false,
  //       location: '',
  //       humidity: null,
  //       weatherCondition: 'Error',
  //     });
  //   }
  // );
  //   }
  //   setFetc(false);
  // }, [fetc, fetchWeather]);
  useInterval(
    async () => {
      if (permis?.geo) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const dis = calculateDistance({
              latitude: 13.8293156,
              longitude: 100.5292102,
            }, {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            })
            setState({
              markers: [
                {
                  coordinate: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  },
                  key: id++,
                  color: randomColor(),
                  description: `ห่าง ${dis?.toFixed(2)}เมตร`,
                  distance: dis?.toFixed(2),
                },
              ],
            },
            )
          },
          (error) => {
            console.log(error)
          },
        )
      } else {
        console.log('Geolocation Permission denied')
      }
    }, 1000)

  // React.useEffect(
  //   () => {
  //     if (gps) {
  //       state.markers.map((marker) => {
  //         try {
  //           const dis = calculateDistance({
  //             latitude: 13.829697654936236,
  //             longitude: 100.5103537067771,
  //           }, {
  //             latitude: marker?.coordinate.latitude,
  //             longitude: marker?.coordinate.longitude,
  //           })
  //           setState({
  //             markers: [
  //               // ...state.markers,
  //               {
  //                 ...marker,
  //                 distance: dis,
  //               },
  //             ],
  //           },
  //           )
  //         } catch (err) {
  //           console.log(err)
  //         }
  //       })
  //       setGps(false)
  //     }
  //   }, [gps, state.markers])
  // console.log(state?.markers[0]?.distance)
  // const t = document.querySelector('#status')
  // console.log(permis)
  return (
  // <PaperProvider>
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
      >
        <Marker
          key={0}
          coordinate={{
            latitude: 13.8293156,
            longitude: 100.5292102,
          }}
          title="My HOME"
        >
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 10, zIndex: 0,
          }}
          >
            <MaterialCommunityIcons name="home-circle" size={20} color="green" />
          </View>
        </Marker>
        {state.markers.map((marker) => (
          <Marker
            key={marker.key + 1}
            coordinate={marker.coordinate}
            pinColor={marker.color}
            title={marker?.description}
          >
            <View style={{
              borderRadius: 20, zIndex: 1,
            }}
            >
              <View style={{
                backgroundColor: 'rgba(0,0,0,1)', color: '#ffff', borderRadius: 20, padding: 10, zIndex: 4,
              }}
              >
                <Text style={{ color: '#fff' }}>{marker?.distance}</Text>
                {/* <MaterialCommunityIcons name="account" size={20} color="green" /> */}
              </View>

            </View>
          </Marker>
        ))}
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => setState({ markers: [] })}
          style={styles.bubble}
        >
          <Text>Tap to create a marker of random color</Text>
        </TouchableOpacity>
      </View>
    </View>
  // </PaperProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
})
