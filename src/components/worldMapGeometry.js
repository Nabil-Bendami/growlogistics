import { geoContains, geoInterpolate, geoNaturalEarth1, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import atlas from 'world-atlas/countries-110m.json'

export const countries = feature(atlas, atlas.objects.countries).features
export const projection = geoNaturalEarth1().fitExtent([[28, 28], [1172, 602]], { type: 'Sphere' })
export const path = geoPath(projection)
export const validCoordinates = coordinates => Array.isArray(coordinates) && coordinates.length === 2 && coordinates.every(Number.isFinite) && Math.abs(coordinates[0]) <= 180 && Math.abs(coordinates[1]) <= 90

export function connectionGeometry(origin, destination) {
  const interpolate = geoInterpolate(origin, destination)
  // Spherical interpolation creates curved routes. D3's stream clips them at the
  // antimeridian instead of drawing an erroneous line across the whole map.
  const coordinates = Array.from({ length: 121 }, (_, index) => interpolate(index / 120))
  return { interpolate, d: path({ type: 'LineString', coordinates }) }
}

export function originCountry(coordinates) {
  return countries.find(country => geoContains(country, coordinates))?.id
}
