import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Configuracion from './Configuracion';
import ConfiguracionFlete from './ConfiguracionFlete';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function MateriaPrimaTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box flexGrow = {1} mt={9}>
        <Box width={'100%'}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Materia Prima" {...a11yProps(0)} />
                <Tab label="Materia Prima Flete" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <Box height={'80vh'}>
                    <Configuracion/>
                </Box>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Box height={'80vh'}>
                    <ConfiguracionFlete/>
                </Box>
            </CustomTabPanel>
        </Box>
    </Box>
  );
}