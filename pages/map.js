import '@fortawesome/fontawesome-svg-core/styles.css';
import '@reach/combobox/styles.css';
import { css } from '@emotion/react';
import { faSearchengin } from '@fortawesome/free-brands-svg-icons';
import {
  faArrowRight,
  faHeartCirclePlus,
  faWheelchairMove,
  faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getDistricts,
  getReviews,
  getUserByValidSessionToken,
} from '../util/database';

// import { PlacesAutocomplete } from './places.js';

const mapContainerStyle = {
  maxWidth: '100%',
  minHeight: '70vh',
  backgroundColor: '#cad5dc',
};

const mapsSytling = css`
  height: 50vh;
  display: flex;
  flex-direction: row;
  max-width: 200vw;
  min-height: 70vh;
  gap: 2rem;
  background-color: white;
  @media (max-width: 950px) {
    width: 180vw;
    /* height: 100px; */
    /* padding-left: 30px; */
    margin-left: 30px;
    height: 60vh;
    gap: 2rem;
  }

  .google {
    flex: 1;
    @media (max-width: 950px) {
      flex: 1;
    }
    box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
      0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
      0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086),
      0 100px 80px rgba(0, 0, 0, 0.12);
  }
`;

const mainDiv = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 25vw;
  min-height: 100vh;
  background-color: white;

  @media (max-width: 950px) {
    max-width: 70vw;
    height: 50vh;
  }
  #headline {
    font-size: 20px;
    align-self: center;
    @media (max-width: 950px) {
      font-size: 17px;
    }
  }
  p {
    padding-left: 10px;
    @media (max-width: 950px) {
    }
  }

  input {
    border: solid 0.1px;
    border-radius: 2px;
    height: 2rem;
    border-color: #ced9e1;
  }
`;

const libraries = ['places'];

const options = {
  disableDefaultUI: false,
  zoomControl: true,
};

const paginationDivs = css`
  /* max-width: 30vw; */
  padding: 1rem;
  background-color: white;
  justify-content: space-between;
  display: grid;
  grid-template-rows: 100%;
  height: 70vh;
  width: 27vw;
  overflow-y: scroll;
  scrollbar-color: transparent;
  @media (max-width: 950px) {
    width: 75vw;
    /* display: none; */
  }
  /* scrollbar-width: none; */
  ::-webkit-scrollbar {
    width: 12px;
  }
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);

    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;

    box-shadow: inset 0 0 6px rgba(255, 206, 35, 1);
  }

  padding-right: 20px;

  .streetDescriptions {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1rem;
    margin: 1rem;
    width: 22vw;
    height: 57vh;

    box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
      0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
      0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086),
      0 100px 80px rgba(0, 0, 0, 0.12);

    @media (max-width: 950px) {
      width: 83%;
    }
    .streetHeadline {
      font-family: arvo;
      font-size: 1.6rem;
      @media (max-width: 950px) {
        font-size: 1rem;
      }
    }

    .buttonArrow {
      background-color: white;
      border-radius: 50%;
      max-width: 2.4rem;
      min-height: 2rem;
      font-size: 20px;
      color: purple;
      @media (max-width: 950px) {
        display: flex;
        width: 2rem;
        justify-content: center;
        align-items: center;
      }

      &:hover {
        border-color: #8a71b8;
        cursor: pointer;
      }
    }

    .descriptionStreets {
      display: flex;
      flex-direction: column;
    }
    .addToFavorite {
      min-height: 6vh;
      background-color: transparent;
      width: 10vw;
      border: none;
      @media screen {
        width: 60vw;
        display: flex;
      }
      &:hover {
        cursor: pointer;
        transition: 0.3s ease-in-out;
        color: #ea4335;

        border-color: black;
      }

      &:active {
        transform: translateX(2px) translateY(-2.5px);
      }

      .favIcon {
        color: #d97409;
        font-size: 20px;
        &:hover,
        &:active {
          cursor: pointer;
          transition: 0.3s ease-in-out;
          color: #ea4335;
          transform: translateX(2px) translateY(-2.5px);
        }
      }
    }

    .showMoreInfo {
      display: grid;

      grid-template-columns: 50% 50%;
      align-items: center;
    }
    /*  */
    p {
      font-family: Open Sans;
      color: black;
      font-weight: 600;

      font-size: 1rem;

      @media (max-width: 950px) {
        font-size: 1rem;
      }
      &:hover {
        color: #8a71b8;
      }
    }
  }

  .selectedDescription {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1rem;
    margin: 1rem;
    background-color: #ced9e1;
    width: 22vw;
    height: 57vh;

    position: relative;
    @media (max-width: 950px) {
      width: 83%;
    }

    .buttonArrow {
      background-color: #ced9e1;

      min-height: 1.8rem;

      font-size: 18px;
      color: purple;
      border: none;
      @media (max-width: 950px) {
        display: flex;
        width: 2rem;
        justify-content: center;
        align-items: center;
      }

      &:hover {
        border-color: #8a71b8;
        cursor: pointer;
      }
    }

    .streetHeadline {
      font-family: arvo;
      font-size: 1.6rem;
      @media (max-width: 950px) {
        font-size: 1rem;
      }
    }

    &:hover {
      transition: 0.4s ease-in-out;
      opacity: 0.8;
    }
    box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
      0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
      0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086),
      0 100px 80px rgba(0, 0, 0, 0.12);
    .addToFavorite {
      min-height: 6vh;
      background-color: transparent;
      width: 10vw;
      border: none;
      @media screen {
        width: 60vw;
        display: flex;
      }

      &:hover {
        cursor: pointer;
        transition: 0.3s ease-in-out;
        color: #ea4335;
        border-color: black;
      }

      &:active {
        transform: translateX(2px) translateY(-2.5px);
      }

      .favIcon {
        color: #d97409;
        font-size: 20px;
        &:hover,
        &:active {
          cursor: pointer;
          transition: 0.3s ease-in-out;
          color: #ea4335;
          transform: translateX(2px) translateY(-2.5px);
        }
      }
    }
    .showMoreInfo {
      display: grid;

      grid-template-columns: 50% 50%;
      align-items: center;
    }
    h1 {
      font-family: arvo;
      font-size: 28px;
    }
    /* p {
      font-family: Open Sans;
      color: black;
      font-weight: 600;

      @media (max-width: 950px) {
        font-size: 1rem;
      }
    } */
  }
`;

const showMOreLessButtons = css`
  display: flex;
  justify-content: center;
  height: 2rem;
  border: none;
  gap: 1rem;

  button {
    border-radius: 28px;
    border: none;
    max-width: 200px;
    min-height: 6vh;
    background-color: #8a71b8;
    font-family: Arvo;
    font-style: inherit;
    font-size: 12pt;
    color: white;
    cursor: pointer;
    &:hover {
      background-color: #8a71b8;
    }
  }
`;

const modalStyling = css`
  body.active-modal {
    overflow-y: hidden;
  }

  .btn-modal {
    border-radius: 50%;
    border: solid 1px;
    border-color: #e7b825;
    max-width: 1.3rem;
  }

  .modal,
  .overlay {
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: fixed;
    @media (max-width: 950px) {
      width: 100%;
      height: 100%;
    }
  }

  .overlay {
    background: rgba(49, 49, 49, 0.8);
  }
  .modal-content {
    position: absolute;
    top: 40%;
    left: 50%;

    transform: translate(-50%, -50%);
    line-height: 1.4;
    background: #f1f1f1;
    background-image: url('/wheelchair.png');
    padding: 14px 28px;
    border-radius: 3px;
    width: 50vw;

    min-height: 50vh;
    color: white;
    @media (max-width: 950px) {
      width: 110vw;
      min-height: 50vh;

      top: 40%;
      left: 50%;
      background-image: url('/wheelchair.png');
      background-size: cover;
      transform: translate(-50%, -50%);
    }
    h3 {
      font-style: Open sans;
    }

    .textarea {
      width: 70%;
      #inputfield {
        width: 77%;
        height: 15vh;
        @media (max-width: 950px) {
          font-size: 17px;
          width: 95%;
        }
      }
    }
    .reviewArea {
      display: flex;

      flex-direction: row;
    }
    .reviewResults {
      width: 50%;
      font-family: Open Sans;
      @media (max-width: 950px) {
      }
      h2 {
        font-family: Montserrat;
      }
    }
  }

  .close-modal {
    position: absolute;
    border: none;
    color: white;
    font-size: 25px;
    cursor: pointer;
    background-color: transparent;
    top: 10px;
    right: 10px;
    padding: 5px 7px;
  }
`;
const buttons = css`
  /* height: 100px; */
  border-radius: 28px;
  border: none;
  max-width: 200px;
  min-height: 5vh;
  background-color: #8a71b8;
  font-family: Open Sans;
  font-style: inherit;
  font-size: 11pt;
  color: white;
  cursor: pointer;
  font-family: arvo;

  @media (max-width: 950px) {
    font-size: 10pt;
    font-weight: bold;
    font-family: arvo;
    width: 44vw;
  }
  &:hover {
    background-color: #ffc80a;
  }
`;

const loadingContainer = css`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  background: white;
  z-index: 1;
  font-style: Montserrat;

  p {
    padding-left: 25px;
    color: black;

    font-size: 30px;
    text-align: center;
    animation: glow 1s ease-in-out infinite alternate;

    @keyframes glow {
      from {
        text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #ffc80a,
          0 0 40px #ffc80a, 0 0 50px #ffc80a, 0 0 60px #ffc80a, 0 0 70px #ffc80a;
      }

      to {
        text-shadow: 0 0 20px #fff, 0 0 30px #ffc80a, 0 0 40px #ffc80a,
          0 0 50px #ffc80a, 0 0 60px #ffc80a, 0 0 70px #ffc80a, 0 0 80px #ffc80a;
      }
    }
  }

  .spinner {
    width: 64px;
    height: 64px;
    border: 8px solid;
    border-color: black transparent black transparent;
    border-radius: 50%;
    animation: spin-anim 4s linear infinite;
  }

  @keyframes spin-anim {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const selectionBar = css`
  font-family: Montserrat;
  display: flex;
  justify-content: center;
  width: 28vw;
  padding-left: 10px;
  padding-right: 20px;

  /* gap: 1rem;
  padding-left: 20px; */
  @media (max-width: 950px) {
    width: 280px;
    /* padding-right: 170px; */
    font-size: 10px;
  }
  select {
    background-image: linear-gradient(45deg, transparent 50%, white 20%),
      linear-gradient(135deg, white 50%, transparent 50%),
      linear-gradient(to right, #8a71b8, #8a71b8);
    background-position: calc(100% - 20px) calc(1em + 2px),
      calc(100% - 15px) calc(1em + 2px), 100% 0;

    @media (max-width: 950px) {
      background-size: 5px 5px, 5px 5px, 3.6em 2.5em;
    }
    background-size: 5px 5px, 5px 5px, 2.5em 2.5em;
    background-repeat: no-repeat;
    background-color: white;
    border: thin solid #8a71b8;
    border-radius: 4px;
    display: inline-block;
    font: inherit;
    line-height: 1.4em;
    padding: 0.5em 3.5em 0.5em 1em;
    margin: 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-appearance: none;
    -moz-appearance: none;

    overflow-y: scroll;
    scrollbar-color: transparent;
    /* scrollbar-width: none; */
    ::-webkit-scrollbar {
      width: 12px;
    }
    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);

      border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 10px;

      box-shadow: inset 0 0 6px rgba(255, 206, 35, 1);
    }
  }

  select:focus {
    background-image: linear-gradient(45deg, #ffba0a 50%, transparent 50%),
      linear-gradient(135deg, transparent 50%, #ffba0a 50%),
      linear-gradient(to right, grey, grey);
    background-position: calc(100% - 15px) 1em, calc(100% - 20px) 1em, 100% 0;

    @media (max-width: 950px) {
      background-size: 5px 5px, 5px 5px, 3.6em 2.5em;
    }
    background-size: 5px 5px, 5px 5px, 2.5em 2.5em;
    background-repeat: no-repeat;
    border-color: grey;
    outline: 0;
    background-color: white;
    border: thin solid #8a71b8;
    border-radius: 4px;
    display: inline-block;
    font: inherit;
    line-height: 1.4em;
    padding: 0.5em 3.5em 0.5em 1em;

    /* reset */

    margin: 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-appearance: none;
    -moz-appearance: none;
  }
`;

const searchInputfield = css`
  width: 30vw;
  display: flex;
  justify-content: center;
  padding: 0;
  /* margin: 0; */
  @media (max-width: 950px) {
    width: 47vw;
  }
`;

const notloggedIn = css`
  width: 100vw;
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  gap: 3rem;

  .wheelchair {
    font-size: 70px;
    color: #8a71b8;
  }
  .container {
    width: 70vw;
    height: 50vh;
    background-color: #8a71b8;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    h1 {
      font-family: Arvo;
      font-weight: 100;
    }
    box-shadow: black 0px 0px 0px 2px inset,
      rgb(255, 255, 255) 10px -10px 0px -3px, rgb(255, 217, 19) 10px -10px,
      rgb(255, 255, 255) 20px -20px 0px -3px, rgb(110, 107, 106) 20px -20px;
    .contentContainer {
      height: 40vh;
      width: 60vw;

      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;

const buttonLoginFirst = css`
  border-radius: 28px;
  border: none;
  width: 8vw;
  margin: 1rem;
  min-height: 6vh;
  background-color: #ffc80a;
  font-family: Open Sans;
  font-style: inherit;
  font-size: 12pt;
  font-weight: 600;
  color: white;

  cursor: pointer;

  &:hover {
    color: black;
  }

  @media screen and (max-width: 950px) {
    width: 24vw;
  }
`;

const postreviewButton = css`
  /* height: 100px; */
  border-radius: 28px;
  border: none;
  max-width: 200px;
  min-height: 5vh;
  background-color: #ffc80a;
  font-family: Open Sans;
  font-style: inherit;
  font-size: 11pt;
  color: white;
  cursor: pointer;
  font-family: arvo;

  @media (max-width: 950px) {
    font-size: 10pt;
    font-weight: bold;
    font-family: arvo;
    width: 44vw;
  }
  &:hover {
    background-color: #8a71b8;
  }
`;

export default function Map(props) {
  const [parking, setParking] = useState();
  const [loading, setLoading] = useState(true);
  const [checkedButton, setCheckedButton] = useState(24);
  const [lat, setLat] = useState(48.2083);
  const [lng, setLng] = useState(16.3731);
  const [zoomIn, setZoomIn] = useState(14);
  const [searchTerm, setSearchTerm] = useState('');
  const [review, setReview] = useState(props.reviews);
  const [visible, setVisible] = useState(3);
  const [modal, setModal] = useState(false);
  const [sendIdToReview, setSendIdToReview] = useState({});
  const [currentReview, setCurrentReview] = useState();
  const [filteredReviewsState, setFilteredReviewsState] = useState();
  const [streetName, setStreetName] = useState({});
  const [streetNameNumber, setStreetNameNumber] = useState();

  // show more pagaination function, that always displays the next three parking spots or calls the back with show less.

  const showMoreItems = () => {
    setVisible((prevValue) => prevValue + 3);
  };
  console.log('props', props);
  const showLessItems = () => {
    setVisible((prevValue) => prevValue - 3);
  };

  // add to favorites function for single parking spots, they will be display in the profile page

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
    console.log('registerResponse', registerResponseBody);
    if ('errors' in registerResponseBody) {
    }
  }

  // posting reviews to api and to and send it from api to database afterwards

  async function newReview() {
    const registerResponse = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        review: currentReview,
        location_id: sendIdToReview,
      }),
    });
    if (typeof sendIdToReview === 'undefined') {
      return undefined;
    }
    const registerResponseBody = await registerResponse.json();
    console.log('registerResponseBody', registerResponseBody);
    if ('errors' in registerResponseBody) {
    }

    setReview([...review, registerResponseBody.review]);
    console.log('log from review', review);
  }
  // loadscript function to display google maps libraries and send the googleMapsApi to the google servers

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: props.googleAPI,
    libraries,
  });

  const url =
    'https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:BEHINDERTENPARKPLATZOGD&srsName=EPSG:4326&outputFormat=json';

  // fetching api data with useEffect

  useEffect(() => {
    async function getParking() {
      const response = await fetch(url);
      const data = await response.json();

      setLoading(false);

      setParking(data);
    }
    getParking().catch(() => {});
  }, []);

  console.log(loading);

  // useEffect that sends value to useState hook, to display reviews without page reload

  useEffect(() => {
    const updatedFilteredReviews = review.filter(
      (r) => r.locationId === sendIdToReview,
    );
    setFilteredReviewsState(updatedFilteredReviews);
  }, [review, sendIdToReview]);

  // loading googleMaps callback function

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  console.log('parking', parking);

  // loading screen animation

  if (!parking) {
    return (
      <div>
        <div css={loadingContainer}>
          <div className="spinner" />
          <p>Accessible Parking Spot finder loading...</p>{' '}
        </div>
      </div>
    );
  }

  // filter method to see if the checked button that comes from the value of the dropdown menu where districts are saved, is the same value as the actually district? So we dont need to sort the fetched array of objects. Checked button always changes with a click on a district in dropdown.

  const description = parking.features.filter(
    (park) => park.properties.BEZIRK === Number(checkedButton),
  );

  // return all markers with map function, that display only parking spots for districts we clicked in dropdown.

  const mappingMarkers = description.map((item) => {
    return (
      <div style={{ zIndex: 1 }} key={item.id}>
        <MarkerF
          key={item.id}
          position={{
            lat: item.geometry.coordinates[1],
            lng: item.geometry.coordinates[0],
          }}
          // set zIndex so wheelchair parking sign marker and this markers dont overlap
          zIndex={-1}
          scaledSize={window.google.maps.Size(20, 20)}
        />
      </div>
    );
  });

  const stateDescription = description.map((item) => {
    return { ...item, state: false };
  });

  const center = {
    lat: lat,
    lng: lng,
  };

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';

  const toggleModal = () => {
    setModal(!modal);
  };
  if (modal) {
    document.body.classList.add('active-modal');
  } else {
    document.body.classList.remove('active-modal');
  }

  // console.log('filteredReviews', filteredReviews);

  return (
    <div>
      {props.user ? (
        <div>
          <Head>
            <title>Parking Spot Search</title>
            <meta
              name="Parking"
              content="Search for a parking spot with google maps"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div css={mapsSytling}>
            <div css={mainDiv}>
              <h1 id="headline">Welcome!</h1>
              <p className="welcomeParagraph">
                Please choose a district and click <u>show on Map</u> to see
                your Parking Spot on the Map
              </p>

              <div css={selectionBar}>
                <select
                  data-test-id="selection-bar"
                  placeholder="Districts"
                  onChange={(event) => {
                    setCheckedButton(event.currentTarget.value);
                  }}
                >
                  {' '}
                  {props.districts.map((item) => (
                    <option key={item.district} value={item.district}>
                      {item.district} {item.name}
                    </option>
                  ))}
                </select>
              </div>
              {checkedButton < 24 ? (
                <div>
                  <div css={searchInputfield}>
                    &nbsp;
                    <FontAwesomeIcon icon={faSearchengin} /> &nbsp;
                    <input
                      placeholder="Search for Streetname"
                      onChange={(event) => {
                        setSearchTerm(event.currentTarget.value);
                      }}
                    />
                  </div>
                  <div css={paginationDivs}>
                    {stateDescription

                      .filter((val) => {
                        return val.properties.STRNAM.toLowerCase().includes(
                          searchTerm.toLowerCase(),
                        );
                      })
                      .slice(0, visible)
                      .map((item) => {
                        // Ternary operator to show all the functions, with inputfields to search streetnames, and to choose streets, if one of the districts is clicked.
                        return checkedButton < 24 ? (
                          <div
                            className={
                              item.geometry.coordinates[1] === lat &&
                              item.geometry.coordinates[0] === lng
                                ? 'selectedDescription'
                                : 'streetDescriptions'
                            }
                            key={item.id}
                          >
                            <div className="streetHeadline">
                              {item.properties.STRNAM} {item.properties.ONR_VON}
                            </div>

                            {
                              // this is the beginning of a row full of several ternary operators, since either BESCHREIBUNG OR ZEITRAUM are null or true in some of the api objects
                              item.properties.BESCHREIBUNG === null &&
                              item.properties.ZEITRAUM ? (
                                <p>
                                  {' '}
                                  <div>
                                    <u>Time-Range:</u> &nbsp;
                                    {item.properties.ZEITRAUM}
                                  </div>
                                  <div>
                                    {' '}
                                    <u> Private or Public:</u> &nbsp;
                                    {item.properties.KATEGORIE_TXT}
                                  </div>
                                </p>
                              ) : item.properties.ZEITRAUM === null &&
                                item.properties.BESCHREIBUNG ? (
                                <div
                                  data-test-id={item.properties.STRNAM}
                                  className="descriptionStreets"
                                >
                                  <p>
                                    <div>
                                      <u> Description:</u>&nbsp;&nbsp;
                                      {item.properties.BESCHREIBUNG}
                                    </div>
                                    <div>
                                      {' '}
                                      <u> Private or Public:</u> &nbsp;
                                      {item.properties.KATEGORIE_TXT}
                                    </div>
                                  </p>
                                </div>
                              ) : item.properties.BESCHREIBUNG &&
                                item.properties.ZEITRAUM ? (
                                <div
                                  data-test-id={item.properties.STRNAM}
                                  className="descriptionStreets"
                                >
                                  <p>
                                    {' '}
                                    <div>
                                      <u>Time-Range:</u> &nbsp;
                                      {item.properties.ZEITRAUM}
                                    </div>
                                    <div>
                                      <u> Description:</u>&nbsp;&nbsp;
                                      {item.properties.BESCHREIBUNG}
                                    </div>
                                    <div>
                                      {' '}
                                      <u> Private or Public:</u> &nbsp;
                                      {item.properties.KATEGORIE_TXT}
                                    </div>
                                  </p>
                                </div>
                              ) : (
                                <div
                                  data-test-id={item.properties.STRNAM}
                                  className="descriptionStreets"
                                >
                                  <p>
                                    <div>
                                      <u> Private or Public:</u> &nbsp;
                                      {item.properties.KATEGORIE_TXT}
                                    </div>
                                  </p>
                                </div>
                              )
                            }
                            <div className="showMoreInfo">
                              <p className="paragraphShowMore">
                                Show more information or write a Review
                              </p>

                              <div>
                                <button
                                  // button that triggers the modal with reviews to open
                                  onClick={() => {
                                    toggleModal();
                                    setSendIdToReview(item.id);
                                    setStreetName(item.properties.STRNAM);
                                    setStreetNameNumber(
                                      item.properties.ONR_VON,
                                    );
                                  }}
                                  className="buttonArrow"
                                >
                                  <FontAwesomeIcon
                                    id="arrowRight"
                                    icon={faArrowRight}
                                  />
                                </button>
                              </div>
                            </div>
                            <button
                              // this button sets latitude and longitude into a useState hook and returns it inside of the google Maps Marker components to display clicked spot on the Map
                              css={buttons}
                              onClick={() => {
                                setLat(item.geometry.coordinates[1]);
                                setLng(item.geometry.coordinates[0]);
                                setZoomIn(14);
                              }}
                            >
                              Show on Map
                            </button>
                            <button
                              data-test-id="favorites"
                              className="addToFavorite"
                              onClick={() => addToFavorites(item)}
                            >
                              <FontAwesomeIcon
                                className="favIcon"
                                icon={faHeartCirclePlus}
                              />{' '}
                              &nbsp; Add to favorites
                            </button>
                          </div>
                        ) : (
                          ''
                        );
                      })}
                    <div css={showMOreLessButtons}>
                      {/* Paginator buttons */}
                      <button onClick={showMoreItems}>Show More</button>
                      <button onClick={showLessItems}>Show Less</button>
                    </div>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>

            <div className="google">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={zoomIn}
                center={center}
                options={options}
                onLoad={onMapLoad}
              >
                {/* returns all Markers for clicked district in the dropdown  */}

                {mappingMarkers}

                <MarkerF
                  // returns one Marker with available parking space sign
                  icon={{
                    url: '/accessiblesign.svg',
                    scaledSize: new window.google.maps.Size(50, 70),
                  }}
                  position={{
                    lat: lat,
                    lng: lng,
                  }}
                  zIndex={5}
                />
              </GoogleMap>
            </div>
          </div>
          {/* beginning of review modal code that pops up  */}
          <div css={modalStyling}>
            {modal && (
              <div className="modal">
                <button onClick={toggleModal} className="overlay" />
                <div className="modal-content">
                  <h1>
                    {' '}
                    {streetName} &nbsp;
                    {streetNameNumber}
                  </h1>
                  <p>
                    Please write a Review about this Parking Spot or look at
                    other people's reviews
                  </p>
                  <div className="reviewArea">
                    <div className="textarea">
                      <textarea
                        id="inputfield"
                        onChange={(event) =>
                          setCurrentReview(event.currentTarget.value)
                        }
                        value={currentReview}
                      />
                      <button
                        css={postreviewButton}
                        onClick={() => {
                          newReview().catch(() => {});
                          setCurrentReview('');
                        }}
                      >
                        Post Review
                      </button>
                    </div>
                    <div className="reviewResults">
                      <h2> Reviews:</h2>
                      <div className="review">
                        {filteredReviewsState.map((item) => {
                          console.log('item', item);
                          return (
                            <div key={item.id}>
                              {' '}
                              <ul>
                                <li>{item.review}</li>
                              </ul>
                            </div>
                          );
                        })}
                        <br />
                      </div>
                    </div>
                  </div>

                  <button className="close-modal" onClick={toggleModal}>
                    <FontAwesomeIcon icon={faXmarkCircle} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // if user is not logged in, show this and tell them to log in first to use all features of this app
        <div>
          <Head>
            <title>You are not logged in</title>
            <meta
              name="Parking"
              content="Search for a parking spot with google maps"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div css={notloggedIn}>
            <FontAwesomeIcon className="wheelchair" icon={faWheelchairMove} />

            <div className="container">
              <div className="contentContainer">
                <h1>
                  Hey, you are currently not logged in. If you want to use all
                  of the features, please log in first.
                </h1>
              </div>
              <div className="buttonContainer">
                <Link href="/login">
                  <button css={buttonLoginFirst}>Login</button>
                </Link>
                <Link href="/login">
                  <button css={buttonLoginFirst}>Register</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const districts = await getDistricts();

  const googleAPI = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );
  // if there is a user please return all necessary information, to prevent an error, when no one is signed or logged in.

  if (user) {
    const reviews = await getReviews(user.id);
    return {
      props: { user, googleAPI, districts, reviews },
    };
  }
  // else return this.
  return {
    props: { googleAPI, districts, reviews: [] },
  };
}
