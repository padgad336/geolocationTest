const calculateDistance = (gpsFirst, gpsSecond) => {
  console.log('API CALCULATE DISTANCE ON MAP WORKING', gpsFirst, gpsSecond)
  try {
    const BETWEEN_DEGREE = 15
    const THOUSAND_METER = 1000

    const SURFACE_DISTANCE_PER_ONE_DEGREE = [
      { latitude: 110.574, longitude: 111.320 }, // 0  degree
      { latitude: 110.649, longitude: 107.551 }, // 15 degree
      { latitude: 110.852, longitude: 96.486 }, // 30 degree
      { latitude: 111.132, longitude: 78.847 }, // 45 degree
      { latitude: 111.412, longitude: 55.800 }, // 60 degree
      { latitude: 111.618, longitude: 28.902 }, // 75 degree
      { latitude: 111.694, longitude: 0.000 }, // 90 degree
    ]

    /**
         * define class GPS for keep latitude and longitude
         */
    const GPS = (lat, lnt) => {
      this.latitude = lat || 0
      this.longitude = lnt || 0
    }

    // eslint-disable-next-line max-len
    const getSurfaceDistance = (gps) => SURFACE_DISTANCE_PER_ONE_DEGREE[parseInt(gps?.latitude / BETWEEN_DEGREE, 10)]

    const getLatitudeDistance = (gps) => getSurfaceDistance(gps)?.latitude * THOUSAND_METER

    const getLongitudeDistance = (gps) => getSurfaceDistance(gps)?.longitude * THOUSAND_METER

    const findDistance = (gps1, gps2) => {
      const latitudeDistance1 = getLatitudeDistance(gps1) // a1
      const latitudeDistance2 = getLatitudeDistance(gps2) // a2

      const longitudeDistance1 = getLongitudeDistance(gps1) // b1
      const longitudeDistance2 = getLongitudeDistance(gps2) // b2

      // (X2 * a2 - X1 * a1) ^ 2
      // eslint-disable-next-line max-len
      const power1 = Math.pow((gps2.latitude * latitudeDistance2) - (gps1.latitude * latitudeDistance1), 2)
      // (Y2 * b2 - Y1 * b1) ^ 2
      // eslint-disable-next-line max-len
      const power2 = Math.pow((gps2.longitude * longitudeDistance2) - (gps1.longitude * longitudeDistance1), 2)

      return Math.sqrt(power1 + power2)
    }

    /**
         * define gps1 and gps2 location
         */
    const gps1 = GPS(gpsFirst.latitude, gpsFirst.longitude)
    const gps2 = GPS(gpsSecond.latitude, gpsSecond.longitude)
    const tess = findDistance(gpsFirst, gpsSecond)
    return tess
  } catch (err) {
    console.log(err)
    return null
  }
}
module.exports = {
  calculateDistance,
}
