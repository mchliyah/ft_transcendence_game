import * as React from 'react';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import label from '@mui/material/FormControlLabel';

export default function ButtonUsage() {
  return (
    <div>
      <Switch {...label} color='primary' defaultChecked/>
<Switch {...label} defaultChecked color="secondary" />
<Switch {...label} defaultChecked color="warning" />
<Switch {...label} defaultChecked color="default" />
{/* <PinkSwitch {...label} defaultChecked /> */}
    </div>
  );
  // <Button variant="contained">Hello world</Button>;
}

