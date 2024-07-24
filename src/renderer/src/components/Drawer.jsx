import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Reportes from './Reporte';
import CuentasPorPagar from './ReporteCuentasPorPagar';
import Configuracion from './Configuracion';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WidgetsIcon from '@mui/icons-material/Widgets';
import SettingsIcon from '@mui/icons-material/Settings';
import { DrawerTitleAtom } from '../atoms/DrawerTitle';
import { useAtom, useAtomValue } from 'jotai';
import { HotkeyActivoAtom } from '../atoms/HotkeyActivoAtom';
import { LoginAtom } from '../atoms/HotkeyActivoAtom';
import LoginPage from './Login';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    variants: [
      {
        props: ({ open }) => open,
        style: {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: 0,
        },
      },
    ],
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function DrawerReporte() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [indexDrawer, setIndexDrawer] = useAtom(DrawerTitleAtom)
  const hotkeyAtivo = useAtomValue(HotkeyActivoAtom)
  const loginAtom = useAtomValue(LoginAtom)

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  let menuItems = [
    {"text": 'Reporte Materia Prima', icon: () => <WidgetsIcon />, getChildren: () => <Reportes/>},
    {"text": 'Reporte Flete', icon: () => <LocalShippingIcon />, getChildren: () => <Reportes/>},
    {"text": 'Reporte Cuentas Por Pagar', icon: () => <LocalShippingIcon />, getChildren: () => <CuentasPorPagar/>},
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                mr: 2,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            { indexDrawer === 3? 'Configuracion': menuItems[indexDrawer].text}
          </Typography>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={()=> {
              setIndexDrawer(3);
            }}
            sx={[
              {
                position: 'absolute',
                ml: 2,
                right: 10
              },
              !hotkeyAtivo && { display: 'none' }
            ]}
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
        {
          menuItems.map((menu, index) => (
            <ListItem key={menu.text} disablePadding>
              <ListItemButton
                onClick={() => setIndexDrawer(index)}>
                <ListItemIcon>
                    {menu.icon()}
                </ListItemIcon>
                <ListItemText primary={menu.text} />
              </ListItemButton>
            </ListItem>
          ))
        }
        </List>
      </Drawer>
      <Main open={open} >
        
        {indexDrawer === 3? (loginAtom == true? <Configuracion/>: <LoginPage/>): menuItems[indexDrawer].getChildren()}

      </Main>
    </Box>
  );
}
