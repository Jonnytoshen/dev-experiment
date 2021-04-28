const path = require('path');
const fs = require('fs');

function decode(json) {
  if (!json.UTF8Encoding) {
      return json;
  }
  var encodeScale = json.UTF8Scale;
  if (encodeScale == null) {
      encodeScale = 1024;
  }

  var features = json.features;

  for (var f = 0; f < features.length; f++) {
      var feature = features[f];
      var geometry = feature.geometry;
      var coordinates = geometry.coordinates;
      var encodeOffsets = geometry.encodeOffsets;

      for (var c = 0; c < coordinates.length; c++) {
          var coordinate = coordinates[c];

          if (geometry.type === 'Polygon') {
              coordinates[c] = decodePolygon(
                  coordinate,
                  encodeOffsets[c],
                  encodeScale
              );
          }
          else if (geometry.type === 'MultiPolygon') {
              for (var c2 = 0; c2 < coordinate.length; c2++) {
                  var polygon = coordinate[c2];
                  coordinate[c2] = decodePolygon(
                      polygon,
                      encodeOffsets[c][c2],
                      encodeScale
                  );
              }
          }
      }
  }
  // Has been decoded
  json.UTF8Encoding = false;
  return json;
}

function decodePolygon(coordinate, encodeOffsets, encodeScale) {
  var result = [];
  var prevX = encodeOffsets[0];
  var prevY = encodeOffsets[1];

  for (var i = 0; i < coordinate.length; i += 2) {
      var x = coordinate.charCodeAt(i) - 64;
      var y = coordinate.charCodeAt(i + 1) - 64;
      // ZigZag decoding
      x = (x >> 1) ^ (-(x & 1));
      y = (y >> 1) ^ (-(y & 1));
      // Delta deocding
      x += prevX;
      y += prevY;

      prevX = x;
      prevY = y;
      // Dequantize
      result.push([x / encodeScale, y / encodeScale]);
  }

  return result;
}

const source = path.join(__dirname, 'src/assets/china-contour.json');
const target = path.join(__dirname, 'src/assets/geo_china.json');
const geojsonString = fs.readFileSync(source, { encoding: 'utf8' });
const geojson = JSON.parse(geojsonString);
const decoded = decode(geojson);

const features = decoded.features.map(({ type, geometry, id, properties}) => {
  const { type: geometryType , coordinates } = geometry;
  return {
    type,
    geometry: {
      type: geometryType,
      coordinates
    }
  };
});

const result = { type: 'FeatureCollection', features };

fs.writeFileSync(target, JSON.stringify(result));