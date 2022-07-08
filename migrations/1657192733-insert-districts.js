const districts = [
  { district: 1, name: 'Innere Stadt 1010 Vienna' },
  { district: 2, name: 'Leopoldstadt 1020 Vienna' },
  { district: 3, name: 'Landstraße 1030 Vienna' },
  { district: 4, name: 'Wieden 1040 Vienna' },
  { district: 5, name: 'Margareten 1050 Vienna' },
  { district: 6, name: 'Mariahilf 1060 Vienna' },
  { district: 7, name: 'Neubau 1070 Vienna' },
  { district: 8, name: 'Josefstadt 1080 Vienna' },
  { district: 9, name: 'Alsergrund 1090 Vienna' },
  { district: 10, name: 'Favoriten 1100 Vienna' },
  { district: 11, name: 'Simmering 1110 Vienna' },
  { district: 12, name: 'Meidling 1120 Vienna' },
  { district: 13, name: 'Hietzing 1130 Vienna' },
  { district: 14, name: 'Penzing 1140 Vienna' },
  { district: 15, name: 'Rudolfsheim-Fünfhaus 1150 Vienna' },
  { district: 16, name: 'Ottakring 1160 Vienna' },
  { district: 17, name: 'Hernals 1170 Vienna' },
  { district: 18, name: 'Währing 1180 Vienna' },
  { district: 19, name: 'Döbling 1190 Vienna' },
  { district: 20, name: 'Brigittenau 1200 Vienna' },
  { district: 21, name: 'Floridsdorf 1210 Vienna' },
  { district: 22, name: 'Donaustadt 1220 Vienna' },
  { district: 23, name: 'Liesing 1230 Vienna' },
];

exports.up = async (sql) => {
  await sql`
	INSERT INTO districts ${sql(districts, 'district', 'name')}
`;
};

exports.down = async (sql) => {
  for (const district of districts) {
    await sql`
  DELETE FROM

	districts

	WHERE


	district = ${district.district} AND
	name = ${district.name}

  `;
  }
};
