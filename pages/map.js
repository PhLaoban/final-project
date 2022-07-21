import '@fortawesome/fontawesome-svg-core/styles.css';
import '@reach/combobox/styles.css';
import { css } from '@emotion/react';
import { faSearchengin } from '@fortawesome/free-brands-svg-icons';
import { faHeartCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getDistricts,
  getReviews,
  getUserByValidSessionToken,
} from '../util/database';

// import { PlacesAutocomplete } from './places.js';

const mapContainerStyle = {
  maxWidth: '80vw',
  minHeight: '80vh',
  backgroundColor: '#cad5dc',
};

const mapsSytling = css`
  height: 50vh;
  display: flex;
  flex-direction: row;
  max-width: 100vw;
  min-height: 80vh;

  .google {
    flex: 1;
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
  max-width: 40vw;
  min-height: 100vh;
  background-color: white;
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
  max-width: 100vw;
  padding: 1rem;
  background-color: white;
  justify-content: space-between;
  display: grid;
  grid-template-rows: 100%;
  height: 70vh;
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

  padding-right: 20px;
  .buttonArrow {
    background-color: white;
    border-radius: 50%;
    max-width: 2.4rem;
    min-height: 2rem;
    border-color: #ffc80a;
    font-size: 20px;
    color: purple;

    &:hover {
      border-color: #8a71b8;
      cursor: pointer;
    }
  }

  .streetDescriptions {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1rem;
    margin: 1rem;

    height: 50vh;

    box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
      0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
      0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086),
      0 100px 80px rgba(0, 0, 0, 0.12);

    .addToFavorite {
      min-height: 6vh;
      background-color: transparent;
      width: 10vw;
      border: none;
      font-size: 15px;
      &:hover {
        cursor: pointer;
        transition: 0.3s ease-in-out;
        color: #ea4335;
        border-bottom: 1px solid #333;
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
    p {
      font-family: Open Sans;
      color: grey;
      font-weight: bold;

      font-size: 1.15rem;
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
    height: 50vh;

    position: relative;
    &::before,
    &::after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: -1;
      border: 2px solid #ffba0a;
      transition: all 0.25s ease-out;
    }
    &::before {
      background-color: #ced9e1;
      top: -10px;
      left: -10px;
    }
    &::after {
      bottom: -10px;
      right: -10px;
    }
    &:hover {
      &::before {
        top: 10px;
        left: 10px;
      }
      &::after {
        bottom: 10px;
        right: 10px;
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

      &:hover {
        cursor: pointer;
        transition: 0.3s ease-in-out;
        color: #ea4335;
        border-bottom: 1px solid #333;
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
    p {
      font-family: Open Sans;
      color: black;
      font-weight: normal;
    }
  }
`;

const showMOreLessButtons = css`
  display: flex;
  justify-content: center;
  height: 2rem;
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
    max-width: 50vw;

    min-height: 50vh;
    color: white;
    h3 {
      font-style: Montserrat;
    }
    .reviewArea {
      display: flex;

      flex-direction: row;
    }
    .reviewResults {
      width: 700px;
      display: flex;
      padding: 20px;
      justify-content: flex-end;
      h2 {
        padding-right: 30px;
      }
    }
  }

  .close-modal {
    position: absolute;
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
  min-height: 6vh;
  background-color: #ffc80a;
  font-family: Open Sans;
  font-style: inherit;
  font-size: 12pt;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #8a71b8;
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
  width: 33vw;
  select {
    background-image: linear-gradient(45deg, transparent 50%, white 50%),
      linear-gradient(135deg, white 50%, transparent 50%),
      linear-gradient(to right, #8a71b8, #8a71b8);
    background-position: calc(100% - 20px) calc(1em + 2px),
      calc(100% - 15px) calc(1em + 2px), 100% 0;
    background-size: 5px 5px, 5px 5px, 2.5em 2.5em;
    background-repeat: no-repeat;
    background-color: white;
    border: thin solid #8a71b8;
    border-radius: 4px;
    display: inline-block;
    font: inherit;
    line-height: 1.3em;
    padding: 0.5em 3.5em 0.5em 1em;

    /* reset */

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
    background-size: 5px 5px, 5px 5px, 2.5em 2.5em;
    background-repeat: no-repeat;
    border-color: grey;
    outline: 0;
    background-color: white;
    border: thin solid #8a71b8;
    border-radius: 4px;
    display: inline-block;
    font: inherit;
    line-height: 1.3em;
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

const inputField = css`
  width: 30vw;
  display: flex;
  justify-content: center;
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
  const [streetName, setStreetName] = useState();

  console.log('review', review);
  console.log('sendIdtoReview', sendIdToReview);

  const showMoreItems = () => {
    setVisible((prevValue) => prevValue + 3);
  };
  console.log('props', props);
  const showLessItems = () => {
    setVisible((prevValue) => prevValue - 3);
  };

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
      // setErrors(registerResponeBody.errors);
    }
  }

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
      // setErrors(registerResponeBody.errors);
    }

    setReview([...review, registerResponseBody.review]);
    console.log('log from review', review);
  }

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

  console.log(loading);

  useEffect(() => {
    const updatedFilteredReviews = review.filter(
      (r) => r.locationId === sendIdToReview,
    );
    setFilteredReviewsState(updatedFilteredReviews);
  }, [review, sendIdToReview]);

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  console.log('parking', parking);

  const mappingDistricts =
    parking &&
    parking.features.map((item) => {
      return item.properties.BEZIRK;
    });

  if (!mappingDistricts) {
    return (
      <div>
        <div css={loadingContainer}>
          <div className="spinner" />
          <p>Accessible Parking Spot finder loading...</p>{' '}
        </div>
      </div>
    );
  }

  const description = parking.features.filter(
    (park) => park.properties.BEZIRK === Number(checkedButton),
  );

  const mappingMarkers = description.map((item) => {
    return (
      <div style={{ zIndex: 1 }} key={item.id}>
        <MarkerF
          key={item.id}
          position={{
            lat: item.geometry.coordinates[1],
            lng: item.geometry.coordinates[0],
          }}
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
          <div css={mapsSytling}>
            <div css={mainDiv}>
              <div css={selectionBar}>
                <select
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
                  <div css={inputField}>
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
                            {/* <div key={item.id} css={descriptionDiv}> */}{' '}
                            <h1>
                              {item.properties.STRNAM} {item.properties.ONR_VON}{' '}
                            </h1>
                            <p>
                              {' '}
                              {item.properties.BESCHREIBUNG}
                              {item.properties.ZEITRAUM}
                              {item.properties.KATEGORIE_TXT}
                            </p>
                            <div className="showMoreInfo">
                              <p className="paragraphShowMore">
                                Show more information or write a Review
                              </p>

                              <div>
                                <button
                                  onClick={() => {
                                    toggleModal();
                                    setSendIdToReview(item.id);
                                    setStreetName(item.properties.STRNAM);
                                  }}
                                  className="buttonArrow"
                                >
                                  &#129122;
                                </button>
                              </div>
                            </div>
                            <button
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
              {/* <PlacesAutocomplete setSelected={setSelected} /> */}

              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={zoomIn}
                center={center}
                options={options}
                onLoad={onMapLoad}
              >
                {mappingMarkers}

                <MarkerF
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
          {/* <div css={loadingScreen}>{loading ? 'Loading...' : ''}</div> */}

          <div css={modalStyling}>
            {modal && (
              <div className="modal">
                <button onClick={toggleModal} className="overlay" />
                <div className="modal-content">
                  <h1> {streetName}</h1>
                  <h3>
                    Hello write a Review about this Parking Spot or look at
                    other people's reviews
                  </h3>
                  <div className="reviewArea">
                    <div>
                      <textarea
                        onChange={(event) =>
                          setCurrentReview(event.currentTarget.value)
                        }
                        value={currentReview}
                      />
                      <button
                        css={buttons}
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
                              <br />
                              {item.review}
                            </div>
                          );
                        })}
                        <br />
                      </div>
                    </div>
                  </div>

                  <button className="close-modal" onClick={toggleModal}>
                    CLOSE
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h1>
            Hey, you are currently not logged in. If you want to use all of the
            features, please log in first.
          </h1>

          <button>Proceed to login</button>
        </div>
      )}
    </div>
  );
}

// const PlacesAutocomplete = ({ setSelected }) => {
//   const {
//     ready,
//     value,
//     setValue,
//     suggestions: { status, data },
//     clearSuggestions,
//   } = usePlacesAutocomplete();

//   const handleSelect = async (address) => {
//     setValue(address, false);
//     clearSuggestions();

//     const results = await getGeocode({ address });
//     const { lat, lng } = await getLatLng(results[0]);
//     setSelected({ lat, lng });
//   };

//   return (
//     <Combobox onSelect={handleSelect}>
//       <ComboboxInput
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//         disabled={!ready}
//         className="combobox-input"
//         placeholder="Search an address"
//       />
//       <ComboboxPopover>
//         <ComboboxList>
//           {status === 'OK' &&
//             data.map(({ place_id, description }) => (
//               <ComboboxOption key={place_id} value={description} />
//             ))}
//         </ComboboxList>
//       </ComboboxPopover>
//     </Combobox>
//   );
// };

export async function getServerSideProps(context) {
  const districts = await getDistricts();

  const googleAPI = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (user) {
    const reviews = await getReviews(user.id);
    return {
      props: { user, googleAPI, districts, reviews },
    };
  }

  return {
    props: { googleAPI, districts, reviews: [] },
  };
}
