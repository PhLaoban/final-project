import { css } from '@emotion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getDistricts } from '../util/database';

const justify = css`
  /* display: flex;
  max-width: 90vw;
  min-height: 90vh;
  justify-content: center;
  align-items: center;
  flex-direction: column; */
`;

export default function Map(props) {
  const [parking, setParking] = useState();
  const [loading, setLoading] = useState(true);
  const [checkedButton, setCheckedButton] = useState(24);
  const [button, setButton] = useState('how are you?');

  // console.log('log from parking', parking);

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

  // const districts = [
  //   { id: 1, District: 1, Name: 'Innere Stadt 1010 Vienna' },
  //   { id: 2, District: 2, Name: 'Leopoldstadt 1020 Vienna' },
  //   { id: 3, District: 3, Name: 'Landstraße 1030 Vienna' },
  //   { id: 4, District: 4, Name: 'Wieden 1040 Vienna' },
  //   { id: 5, District: 5, Name: 'Margareten 1050 Vienna' },
  //   { id: 6, District: 6, Name: 'Mariahilf 1060 Vienna' },
  //   { id: 7, District: 7, Name: 'Neubau 1070 Vienna' },
  //   { id: 8, District: 8, Name: 'Josefstadt 1080 Vienna' },
  //   { id: 9, District: 9, Name: 'Alsergrund 1090 Vienna' },
  //   { id: 10, District: 10, Name: 'Favoriten 1100 Vienna' },
  //   { id: 11, District: 11, Name: 'Simmering 1110 Vienna' },
  //   { id: 12, District: 12, Name: 'Meidling 1120 Vienna' },
  //   { id: 13, District: 13, Name: 'Hietzing 1130 Vienna' },
  //   { id: 14, District: 14, Name: 'Penzing 1140 Vienna' },
  //   { id: 15, District: 15, Name: 'Rudolfsheim-Fünfhaus 1150 Vienna' },
  //   { id: 16, District: 16, Name: 'Ottakring 1160 Vienna' },
  //   { id: 17, District: 17, Name: 'Hernals 1170 Vienna' },
  //   { id: 18, District: 18, Name: 'Währing 1180 Vienna' },
  //   { id: 19, District: 19, Name: 'Döbling 1190 Vienna' },
  //   { id: 20, District: 20, Name: 'Brigittenau 1200 Vienna' },
  //   { id: 21, District: 21, Name: 'Floridsdorf 1210 Vienna' },
  //   { id: 22, District: 22, Name: 'Donaustadt 1220 Vienna' },
  //   { id: 23, District: 23, Name: 'Liesing 1230 Vienna' },
  // ];

  return (
    <div>
      <h1>Mapping Api data:</h1>

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

      <button
        onClick={() => {
          setButton('I am fine thanks');
        }}
      >
        Hey
      </button>
      {button}

      {checkedButton < 24 ? (
        <div>
          <input />
          {description.map((item) => {
            return (
              <div key={item.id}>
                <div key={item.id}>
                  {' '}
                  {item.properties.STRNAM} {item.properties.ONR_VON}
                  {item.properties.BESCHREIBUNG}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const districts = await getDistricts();

  return {
    props: { districts },
  };
}
