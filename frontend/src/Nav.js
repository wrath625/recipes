import React from 'react';
import { useHistory } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
  drawer: {
    [theme.breakpoints.up('lg')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('lg')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
}));

export default function NavBar(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchTimeout, setSearchTimeout] = React.useState(0)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const search = (event) => {
    if (searchTimeout) {
       clearTimeout(searchTimeout);
    }
    setSearchTimeout(setTimeout(function () {
        props.query(null, event.target.value);
      }, 1000)
    )
  }

  const drawer = (
    <React.Fragment>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <ListItem button component="a" href="/">
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary={"Home"} />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button component="a" href="/create">
          <ListItemIcon><AddIcon /></ListItemIcon>
          <ListItemText primary={"Add a recipe"} />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={()=> {
          props.query(null,'Breakfast');
          history.push("/");
          if (mobileOpen) handleDrawerToggle()
          }}>
          <ListItemIcon><SearchIcon /></ListItemIcon>
          <ListItemText primary={"Breakfast"} />
        </ListItem>
        <ListItem button onClick={()=> {
          props.query(null,'Lunch');
          history.push("/");
          if (mobileOpen) handleDrawerToggle()
          }}>
          <ListItemIcon><SearchIcon /></ListItemIcon>
          <ListItemText primary={"Lunch"} />
        </ListItem>
        <ListItem button onClick={()=> {
          props.query(null,'Dinner');
          history.push("/");
          if (mobileOpen) handleDrawerToggle()
          }}>
          <ListItemIcon><SearchIcon /></ListItemIcon>
          <ListItemText primary={"Dinner"} />
        </ListItem>
        <ListItem button onClick={()=> {
          props.query(null,'Appetizer');
          history.push("/");
          if (mobileOpen) handleDrawerToggle()
          }}>
          <ListItemIcon><SearchIcon /></ListItemIcon>
          <ListItemText primary={"Appetizer"} />
        </ListItem>
        <ListItem button onClick={()=> {
          props.query(null,'Side');
          history.push("/");
          if (mobileOpen) handleDrawerToggle()
          }}>
          <ListItemIcon><SearchIcon /></ListItemIcon>
          <ListItemText primary={"Side"} />
        </ListItem>
        <ListItem button onClick={()=> {
          props.query(null,'Meat');
          history.push("/");
          if (mobileOpen) handleDrawerToggle()
          }}>
          <ListItemIcon><SearchIcon /></ListItemIcon>
          <ListItemText primary={"Meat"} />
        </ListItem>
        <ListItem button onClick={()=> {
          props.query(null,'Seafood');
          history.push("/");
          if (mobileOpen) handleDrawerToggle()
          }}>
          <ListItemIcon><SearchIcon /></ListItemIcon>
          <ListItemText primary={"Seafood"} />
        </ListItem>
        <ListItem button onClick={()=> {
          props.query(null,'Baking');
          history.push("/");
          if (mobileOpen) handleDrawerToggle()
          }}>
          <ListItemIcon><SearchIcon /></ListItemIcon>
          <ListItemText primary={"Baking"} />
        </ListItem>
        <ListItem button onClick={()=> {
          props.query(null,'Sauce');
          history.push("/");
          if (mobileOpen) handleDrawerToggle()
          }}>
          <ListItemIcon><SearchIcon /></ListItemIcon>
          <ListItemText primary={"Sauce"} />
        </ListItem>
      </List>
    </React.Fragment>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            Gardiner Family Recipes
          </Typography>

          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onChange={(e) => search(e)}
            />
          </div>

        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden lgUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden mdDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}