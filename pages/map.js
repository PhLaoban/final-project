import { css } from '@emotion/react';
import { Loader } from '@googlemaps/js-api-loader';
import { Status, Wrapper } from '@googlemaps/react-wrapper';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import mapboxgl from 'mapbox-gl';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';

const mapContainerStyle = {
  maxWidth: '70vw',
  minHeight: '70vh',
};

const mapContainerDiv = css`
  /* display: flex;
  max-width: 50vw;
  min-height: 50vw; */
`;

const optionBar = css`
  width: 500px;
`;

const optionsDiv = css`
  width: 100px;
`;

const libraries = ['places'];

const options = { disableDefaultUI: true, zoomControl: true };

export default function Map(props) {
  const [parking, setParking] = useState();

  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(3);

  console.log('log from parking', parking);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: props.googleAPI,
    libraries,
  });

  const url =
    'https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:BEHINDERTENPARKPLATZOGD&srsName=EPSG:4326&outputFormat=json';

  useEffect(() => {
    async function getParking() {
      const response = await fetch(url);
      const data = await response.json();

      setLoading(false);
      setParking(data);
    }
    getParking().catch(() => {});
  }, []);

  const mappingCoordinates =
    parking &&
    parking.features.map((item) => {
      return (
        <Marker
          key={item.id}
          position={{
            lat: item.geometry.coordinates[1],
            lng: item.geometry.coordinates[0],
          }}
        />
      );
    });
  if (!mappingCoordinates) return 'loading!';

  // const mappingDistricts =
  //   parking &&
  //   parking.features.map((item) => {
  //     return <option key={item.id}>{item.properties.BEZIRK}</option>;
  //   });

  const mappingDistricts =
    parking &&
    parking.features.map((item) => {
      return item.properties.BEZIRK;
    });

  if (!mappingDistricts) return 'loading!';

  const description = parking.features.filter(
    (park) => park.properties.BEZIRK === Number(checked),
  );

  // const description = parking.features.find((item) => {
  //   console.log('item.Bezirk', item.properties.BEZIRK);
  //   console.log('dropdown', dropdown);
  //   return item.properties.BEZIRK === Number(dropdown);
  // });

  console.log('description', description);

  // function descriptionTime() {
  //   if (description.properties.ZEITRAUM == null || undefined) {
  //     return '';
  //   } else {
  //     return <div> Time-Range: {description.properties.ZEITRAUM} </div>;
  //   }
  // }

  // const tryOut = descriptionTime();

  // console.log('from dropdown', dropdown);
  // console.log('parking.features', parking.features);

  // const NewMappingDistricts = mappingDistricts.filter((element, index) => {
  //   return mappingDistricts.indexOf(element) !== index;
  // });

  if (!mappingDistricts) return 'loading!';

  // console.log('from mapping', mappingCoordinates);
  // console.log('from mappingDistricts', mappingDistricts);

  const center = {
    lat: 48.2083,
    lng: 16.3731,
  };

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';

  return (
    <div>
      {loading ? 'Loading...' : ''}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={16}
        center={center}
        options={options}
      >
        {mappingCoordinates}
      </GoogleMap>
      {loading ? 'Loading...' : ''}
      <input
        type="checkbox"
        onChange={(event) => {
          setChecked(event.currentTarget.value);
        }}
        value={1}
      />{' '}
      1 |
      <input
        type="checkbox"
        onChange={(event) => {
          setChecked(event.currentTarget.value);
        }}
        value={2}
      />{' '}
      2 |
      <input type="checkbox" value={3} /> 3 |
      <input type="checkbox" /> 4 |
      <div>
        {description.map((item) => {
          return (
            <div key={item.id}>
              {item.properties.STRNAM} {item.properties.ONR_VON}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function getServerSideProps(context) {
  const googleAPI = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  return {
    props: { googleAPI },
  };
}
