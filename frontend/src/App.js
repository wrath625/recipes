import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import NavBar from './Nav.js';
import UnknownRoute from './common/UnknownRoute.js';
import Recipe from './Recipe/Recipe.js';
import RecipeForm from './Recipe/RecipeForm.js';
import ScrollToTop from './common/ScrollToTop.js';
import axios from "axios";
import CircularProgress from '@material-ui/core/CircularProgress';
import { withRouter } from "react-router";

const styles = theme => ({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    marginTop: "24px"
  },
  content: {
    [theme.breakpoints.up('lg')]: {
      marginLeft: 240,
    },
  }
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      recipe: {},
      recipes: [],
      keywords: [],
      foods: [],
      units: [],
      loading: false,
      search: ''
    };
    // this.nextPage = this.nextPage.bind(this);
    // this.handleDelete = this.handleDelete.bind(this);
  }
  
  componentDidMount() {
    this.query(this.props.location.pathname.replace('/',''));
  }

  query = (params = null, search = '') => {
    this.setState({search: ''})
    if (search !== '') this.setState({search: search})
    const api = axios.create()
    api.interceptors.request.use(async (config) => {
      this.setState({loading:true})
      return config;
    })
    api.interceptors.response.use(async (config) => {
      this.setState({loading:false})
      return config;
    })
    api
      .get("/api/keywords/")
      .then((res) => this.setState({keywords: res.data}))
      .catch((err) => {
        this.setState({loading:false})
        console.log(err)
      })
    api
      .get("/api/foods/")
      .then((res) => this.setState({foods: res.data}))
      .catch((err) => {
        this.setState({loading:false})
        console.log(err)
      })
    api
      .get("/api/units/")
      .then((res) => this.setState({units: res.data}))
      .catch((err) => {
        this.setState({loading:false})
        console.log(err)
      })
    if (params && params !== "create") {
      api 
        .get("/api/recipes/" + params.split('/')[0])
        .then((res) => this.setState({recipes: [res.data]}))
        .catch((err) => {
          this.setState({loading:false})
          console.log(err)
        })
    } else if (params !== "create") {
      api
        .get("/api/recipes/?search="+search)
        .then((res) => this.setState({recipes: res.data.results}))
        .catch((err) => {
          this.setState({loading:false})
          console.log(err)
        });
    }
  };

  render() {
    const { classes, location } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        <ScrollToTop>
        <NavBar query={this.query} detail={location.pathname.replace('/','').length > 0}/>
        <div className={classes.toolbar} />
        <Container className={classes.content} maxWidth="lg">
          {this.state.loading ?
            (
              <div style={{
                "display":"flex", 
                "alignItems": "center",
                "justifyContent": "center",
                "marginTop": "25%",
              }}>
                <CircularProgress />
              </div>
            )
            :
            (
              <Switch>
                {/* <Route path="/shopping" exact component={ShoppingList} /> */}

                <Route path="/create" exact render={(props) => (
                  <RecipeForm {...props} keywords={this.state.keywords} foods={this.state.foods} units={this.state.units}/>
                )} />

                <React.Fragment>
                  <Route path="/" exact render={(props) => (
                    <Recipe {...props} search={this.state.search} recipes={this.state.recipes} />
                  )} />
                  
                  <Route path="/:id/edit" exact render={(props) => (
                    <RecipeForm {...props} recipes={this.state.recipes} keywords={this.state.keywords} foods={this.state.foods} units={this.state.units} />
                  )}/>

                  <Route path="/:id" exact render={(props) => (
                    <Recipe {...props} query={this.query} recipes={this.state.recipes} keywords={this.state.keywords} foods={this.state.foods} units={this.state.units} />
                  )}/>
                </React.Fragment>

                <Route component={UnknownRoute} />
              </Switch>
            )
          }
          
        </Container>
        </ScrollToTop>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(withRouter(App));
