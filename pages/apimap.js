import { css } from '@emotion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

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
  const [checked, setChecked] = useState(3);

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
    (park) => park.properties.BEZIRK === Number(checked),
  );

  console.log('description', description);

  console.log('checked', checked);

  return (
    <div>
      <h1>Mapping Api data:</h1>
      {/* {parking.type.map((p) => {
      return <div key={parking.id}></div>;
    })} */}
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
  return {
    props: {},
  };
}
