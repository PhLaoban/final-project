import { css } from '@emotion/react';
import { Loader } from '@googlemaps/js-api-loader';
import { Status, Wrapper } from '@googlemaps/react-wrapper';
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from '@reach/combobox';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
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

export default function Map(props) {
  const [parking, setParking] = useState();

  const [loading, setLoading] = useState(true);
  const [checkedButton, setCheckedButton] = useState(24);
  const [lat, setLat] = useState(48.2083);
  const [lng, setLng] = useState(16.3731);
  const [zoomIn, setZoomIn] = useState(14);
  const [isColor, setIsColor] = useState(false);
  const [selected, setSelected] = useState();

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

  console.log('description', description);

  if (!mappingDistricts) return 'loading!';

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
        <Marker
          position={{
            lat: lat,
            lng: lng,
          }}
        />
      </GoogleMap>
      {loading ? 'Loading...' : ''}
      <div css={mainDiv}>
        <select
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
        <div>
          {description.map((item) => {
            return checkedButton < 24 ? (
              <div>
                {/* <div key={item.id} css={descriptionDiv}> */}
                <div key={item.id} className={item.id}>
                  {' '}
                  <ul>
                    <li>
                      {' '}
                      {item.properties.STRNAM} {item.properties.ONR_VON}
                      {item.properties.BESCHREIBUNG}{' '}
                    </li>
                    <button
                      onClick={() => {
                        setLat(item.geometry.coordinates[1]);
                        setLng(item.geometry.coordinates[0]);
                        setZoomIn(14);
                        setIsColor(!isColor);
                      }}
                    >
                      Show on Map
                    </button>
                  </ul>
                </div>
              </div>
            ) : (
              ''
            );
          })}
        </div>
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
