import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

export default function BasicSelect() {
  const [location, setLocation] = React.useState('');
  const navigate = useNavigate();

  const handleChange = (event: SelectChangeEvent) => {
    setLocation(event.target.value as string);
  };

  const handleSearch = () => {
    navigate(`/search?query=${location}`);
  };

  const hongKongIslandLocations = [
    '中環',
    '北角',
    '天后',
    '灣仔',
    '銅鑼灣',
    '鰂魚涌',
  ];

  const kowloonLocations = [
    '佐敦',
    '九龍塘',
    '尖沙咀',
    '土瓜灣',
    '油麻地',
    '深水埗',
    '旺角',
    '觀塘',
    '太子',
    '新蒲崗'
  ];

  const newTerritoriesLocations = [
    '上水',
    '元朗',
    '葵涌',
    '荃灣',
    '大埔'
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        minWidth: 200,
      }}
    >
      <FormControl fullWidth sx={{ width: '50%' }}>
        <InputLabel id="demo-select-label">按地區搜尋</InputLabel>
        <Select
          labelId="demo-select-label"
          id="demo-select"
          value={location}
          label="Select location"
          onChange={handleChange}
        >
          <MenuItem value="">按地區搜尋</MenuItem>
          <MenuItem disabled>香港島</MenuItem>
          {hongKongIslandLocations.map((loc) => (
            <MenuItem key={loc} value={loc}>
              {loc}
            </MenuItem>
          ))}
          <MenuItem disabled>九龍</MenuItem>
          {kowloonLocations.map((loc) => (
            <MenuItem key={loc} value={loc}>
              {loc}
            </MenuItem>
          ))}
          <MenuItem disabled>新界</MenuItem>
          {newTerritoriesLocations.map((loc) => (
            <MenuItem key={loc} value={loc}>
              {loc}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ my: 2 }}>
        <Button variant="contained" onClick={handleSearch} disabled={!location}>
          Search
        </Button>
      </Box>
    </Box>
  );
}