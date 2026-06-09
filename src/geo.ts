// Georeferencing data taken directly from the KMZ exported in Google Earth Pro.
//
// <LatLonBox>
//   north  -34.38615847855613
//   south  -34.40413901532538
//   east   -58.62322380731131
//   west   -58.63754200337391
//   rotation -19.34100151062012   (degrees, CCW from north — KML convention)
// </LatLonBox>
//
// KML places the image in the axis-aligned LatLonBox (north/south/east/west),
// then rotates it around its centre by `rotation` degrees CCW.
// The three corners below are the actual pixel corners of the rotated image:
//   PLANO_NW → top-left pixel  (0, 0)
//   PLANO_NE → top-right pixel (897, 0)
//   PLANO_SW → bottom-left pixel (0, 1360)
// Computed by rotating each LatLonBox corner by -19.341° CCW around the centre.

export const BARRIO_CENTER: [number, number] = [-34.39515, -58.63038]
export const GUARDIA: [number, number] = [-34.3997, -58.6386]

// Pixel corners of the plano image after KMZ rotation (topLeft, topRight, bottomLeft)
export const PLANO_NW: [number, number] = [-34.38470938, -58.63352961]  // pixel (0, 0)
export const PLANO_NE: [number, number] = [-34.38862233, -58.62001947]  // pixel (897, 0)
export const PLANO_SW: [number, number] = [-34.40167517, -58.64074634]  // pixel (0, 1360)

export const PLANO_IMAGE = `${import.meta.env.BASE_URL}plano.png`
