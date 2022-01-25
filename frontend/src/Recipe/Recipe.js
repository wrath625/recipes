import React from 'react';
import { Grid } from '@material-ui/core';
import RecipeListItem from './RecipeListItem';
import RecipeDetailItem from './RecipeDetailItem.js';
import UnknownRoute from '../common/UnknownRoute';
import Typography from '@material-ui/core/Typography';


export default function Recipe(props) {
  if (props.match.params.id && props.recipes.length > 0 && !props.search) {
    if (!(props.recipes[0] && Object.keys(props.recipes[0]).length === 0 && props.recipes[0].constructor === Object)) {
      return (
        <RecipeDetailItem query={props.query} recipe={props.recipes[0]} />
      );
    } else {
      return <UnknownRoute />
    }
  }

  return (
    <React.Fragment>
      {!props.search ? (<h1>Recipes:</h1>) : (<h1>Search Results for {props.search}:</h1>)}
      <Grid container spacing={3}>
        {props.recipes.length > 0 ? 
          props.recipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.id}>
              <RecipeListItem recipe={recipe} />
            </Grid>
          )) : (<Typography component="p">No results...</Typography>)
        }
      </Grid>
    </React.Fragment>
    );
  
}
