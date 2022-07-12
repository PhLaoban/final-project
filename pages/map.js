import { css } from '@emotion/react';
import { Loader } from '@googlemaps/js-api-loader';
import { Status, Wrapper } from '@googlemaps/react-wrapper';
import {
  GoogleMap,
  Marker,
  MarkerF,
  useLoadScript,
} from '@react-google-maps/api';
import mapboxgl from 'mapbox-gl';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import { getDistricts } from '../util/database';

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

const descriptionDiv = (isColor) => css`
  display: flex;

  background-color: ${isColor ? 'white' : 'limegreen'};
  color: black;
  width: 50vw;
  margin: 10px auto;
`;

const mainDiv = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 50%;
  min-height: 50%;
`;

const libraries = ['places'];

const options = {
  disableDefaultUI: false,
  zoomControl: true,
};

const myDivStyles = (checkedButton) => css`
  border-radius: 5px;
  color: ${checkedButton ? '#000000' : '#ffffff'};
  width: 50vw;
  margin: 10px auto;
`;

const liStyles = (item) => css`
  background-color: ${item.state ? 'yellow' : 'white'};
`;

export default function Map(props) {
  const [parking, setParking] = useState();

  const [loading, setLoading] = useState(true);
  const [checkedButton, setCheckedButton] = useState(24);
  const [lat, setLat] = useState(48.2083);
  const [lng, setLng] = useState(16.3731);
  const [zoomIn, setZoomIn] = useState(14);
  const [isColor, setIsColor] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stateDescriptionHook, setStateDescriptionHook] = useState();
  //   const [errors, setErrors] = useState<
  //   {
  //     message
  //   }[]
  // >([]);

  async function addToFavorites(item) {
    const registerResponse = await fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location_id: item.id,
        latitude: item.geometry.coordinates[1],
        longitude: item.geometry.coordinates[0],
        streetname: item.properties.STRNAM,
        number: item.properties.ONR_VON,
      }),
    });
    const registerResponseBody = await registerResponse.json();
    console.log(registerResponseBody);
    if ('errors' in registerResponseBody) {
      // setErrors(registerResponeBody.errors);
    }
  }

  console.log('log from parking', parking);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: props.googleAPI,
    libraries,
  });

  // handleProductSelect(productId);
  // {
  //   const { borderColor } = this.state;
  //   let newBorderColour = borderColor === 'white' ? 'blue' : 'white';
  //   this.setState({
  //     borderColor: newBorderColour,
  //     active_id: productId,
  //   });
  // }

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

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const mappingDistricts =
    parking &&
    parking.features.map((item) => {
      return item.properties.BEZIRK;
    });

  if (!mappingDistricts) return 'loading!';

  const description = parking.features.filter(
    (park) => park.properties.BEZIRK === Number(checkedButton),
  );
  description.sort();
  console.log('description', description);
  const stateDescription = description.map((item) => {
    return { ...item, state: false };
  });

  console.log('stateDescription', stateDescription);

  const center = {
    lat: lat,
    lng: lng,
  };

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';

  return (
    <div>
      {loading ? 'Loading...' : ''}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={zoomIn}
        center={center}
        options={options}
        onLoad={onMapLoad}
      >
        <MarkerF
          position={{
            lat: lat,
            lng: lng,
          }}
        />
      </GoogleMap>
      {loading ? 'Loading...' : ''}
      <div css={mainDiv}>
        <select
          placeholder="Districts"
          onChange={(event) => {
            setCheckedButton(event.currentTarget.value);
          }}
        >
          {props.districts.map((item) => (
            <option key={item.district} value={item.district}>
              {item.district} {item.name}
            </option>
          ))}
        </select>
        {checkedButton < 24 ? (
          <div>
            <input
              onChange={(event) => {
                setSearchTerm(event.currentTarget.value);
              }}
            />
            {stateDescription
              .filter((val) => {
                if (searchTerm === '') {
                  return val;
                } else if (
                  val.properties.STRNAM.toLowerCase().includes(
                    searchTerm.toLowerCase(),
                  )
                ) {
                  return val;
                }
              })
              .map((item) => {
                return checkedButton < 24 ? (
                  <div css={liStyles(item)}>
                    {/* <div key={item.id} css={descriptionDiv}> */}
                    <div key={item.id}>
                      {' '}
                      <ul>
                        <li key={item.id}>
                          {' '}
                          {item.properties.STRNAM} {item.properties.ONR_VON}
                          {item.properties.BESCHREIBUNG}
                          {item.properties.ZEITRAUM}
                          {item.properties.KATEGORIE_TXT}
                        </li>
                        <button
                          onClick={() => {
                            setLat(item.geometry.coordinates[1]);
                            setLng(item.geometry.coordinates[0]);
                            setZoomIn(14);
                            // stateDescription.map((clicked) => {
                            //   if (item.id === clicked.id) {
                            return { ...item, state: true };
                            // }
                            // }
                            // );
                          }}
                        >
                          Show on Map
                        </button>
                        <button onClick={() => addToFavorites(item)}>
                          Add to favorites
                        </button>
                      </ul>
                    </div>
                  </div>
                ) : (
                  ''
                );
              })}
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const districts = await getDistricts();
  const googleAPI = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  return {
    props: { googleAPI, districts },
  };
}
