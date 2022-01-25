import React from 'react';
import { useHistory } from "react-router-dom";
import Moment from 'react-moment';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2)
  },
  content: {
    padding: theme.spacing(2),
  },
  circle: {
    border: "1px solid #000",
    borderRadius: "100%",
    height: "1.5em",
    width: "1.5em",
    textAlign: "center"
  },
  cellWidth: {
    minWidth: "200px",
  },
  cellWidthDouble: {
    minWidth: "400px",
    verticalAlign: "top",
  },
  media: {
    height: 0,
    paddingTop: '35.00%',
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  procedure: {
    paddingInlineStart: "24px",
    marginBlockStart: "0",
    marginBlockEnd: "0",
  },
  slider: {
    maxWidth: 350
  }
}));



export default function RecipeDetailItem(props) {
  const classes = useStyles();
  const history = useHistory();
  let procedureCount = 0;
  let scalingQuantity = null;
  const [scalingFactor, setScalingFactor] = React.useState(1);
  props.recipe.steps.map((step) => {
    return step.ingredients.map((ingredient) => {
      if (ingredient.primary === true && ingredient.amountInG) {
        scalingQuantity = ingredient.amountInG
      }
      return null
    })
  })

  function calcScaling(amount, scaling) {
    let value = ((amount / scaling) * 100).toFixed(2)
    if (value >= 0.1) value = Number(value).toFixed(1)
    if (value >= 1) value = Math.round(value)
    if (value <= 0) return null
    return value
  }

  const handleClick = (search) => {
    props.query(null, search)
    history.push("/");
  };

  const handleChange = (event, newValue) => {
    setScalingFactor(newValue);
  };

  function valuetext(value) {
    return `${value}x`;
  }

  
  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        image={props.recipe.image}
        title={props.recipe.name}
      />
      <CardHeader
          title={props.recipe.name}
          titleTypographyProps={{'variant': 'h3', 'component': 'h1'}}
          subheader={
            <React.Fragment>
              <div>Yields {props.recipe.servings * scalingFactor} {props.recipe.servingsText}</div>
              <div>Added <Moment format="MMMM D, YYYY">{props.recipe.createdTime}</Moment> by {props.recipe.createdBy}{props.recipe.updatedTime && (<span> and last updated <Moment format="MMMM D, YYYY">{props.recipe.updatedTime}</Moment></span>)}</div>
            </React.Fragment>
          }
          action={
            <IconButton aria-label="settings" href={props.recipe.slug + "/edit"}>
              <EditIcon />
            </IconButton>
          }
      />
      <CardMedia>
        <Paper component="ul" elevation={0} style={{"paddingInlineStart":"16px"}}>
          {props.recipe.keywords.map((keyword) => (
            <Chip
              key={keyword.id}
              //icon={icon}
              onClick={() => handleClick(keyword.name)}
              label={keyword.name}
              className={classes.chip}
          />
          ))}
        </Paper>
      </CardMedia>
      <CardContent>
        <Typography paragraph>
          {props.recipe.description}
        </Typography>
      </CardContent>
      <CardContent>
      <Typography variant="subtitle2">
        Batch Size
      </Typography>
      <Slider
        className={classes.slider}
        value={scalingFactor}
        onChange={handleChange}
        getAriaValueText={valuetext}
        aria-labelledby="scaling factor"
        step={null}
        marks={
          [
            {
              value: 0.5,
              label: '0.5x',
            },
            {
              value: 1,
              label: '1x',
            },
            {
              value: 1.5,
              label: '1.5x',
            },
            {
              value: 2,
              label: '2x',
            },
            {
              value: 2.5,
              label: '2.5x',
            },
            {
              value: 3,
              label: '3x',
            },
            {
              value: 3.5,
              label: '3.5x',
            },
            {
              value: 4,
              label: '4x',
            },
          ]
        }
        min={0.0}
        max={4}
        valueLabelDisplay="auto"
      />
      </CardContent>
      <CardMedia>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="recipe steps">
            <TableHead>
              <TableRow>
                <TableCell component="th" scope="row" style={{"whiteSpace": "nowrap"}}><Typography variant="button" color="textPrimary" component="h3">Ingredient</Typography></TableCell>
                <TableCell component="th" scope="row"><Typography variant="button" color="textPrimary" component="h3">Quantity</Typography></TableCell>
                <TableCell component="th" scope="row"><Typography variant="button" color="textPrimary" component="h3">Scaling</Typography></TableCell>
                <TableCell component="th" scope="row"><Typography variant="button" color="textPrimary" component="h3">Procedure</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.recipe.steps.map((row) => (
                <TableRow key={row.id}>
                  <TableCell style={{"whiteSpace": "nowrap"}}>
                    <Typography variant="subtitle2" color="textPrimary" component="p">
                      {row.name}
                    </Typography>
                    {row.ingredients.map((ingredient) => (
                      <Typography variant="body2" color="textPrimary" component="p" key={ingredient.id}>
                        {ingredient.food.name}
                        {ingredient.foodNote && (<span> ({ingredient.foodNote})</span>)}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell style={{"whiteSpace": "nowrap"}}>
                    {row.name ? (<Typography variant="subtitle2" color="textPrimary" component="p"><br /></Typography>) : null}
                    {row.ingredients.map((ingredient) => (
                      <Typography variant="body2" color="textPrimary" component="p" key={ingredient.id}>
                        {!ingredient.optional ? 
                          (
                            <span>{Number((ingredient.amount * scalingFactor).toFixed(2)).toString()} {ingredient.unit && ingredient.unit.name} {ingredient.unitNote && (<span>({ingredient.unitNote})</span>)}</span>
                          )
                          :
                          (<span>as needed</span>)
                        }
                        </Typography>
                    ))}
                  </TableCell>
                  <TableCell>
                    {row.name ? (<Typography variant="subtitle2" color="textPrimary" component="p"><br /></Typography>) : null}
                    {row.ingredients.map((ingredient) => (
                      <Typography variant="body2" color="textPrimary" component="p" key={ingredient.id}>
                        {ingredient.amountInG && scalingQuantity && calcScaling(ingredient.amountInG, scalingQuantity).toString() + "%"}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell className={classes.cellWidthDouble}>
                    <ol start={procedureCount+1} className={classes.procedure}>
                    {row.name ? (<Typography variant="subtitle2" color="textPrimary" component="p"><br /></Typography>) : null}
                    {row.procedures.map((procedure) => {
                      procedureCount += 1;
                      return (
                        <li key={procedure.id}>
                          <Typography variant="body2" color="textPrimary" component="p">
                            {procedure.description} 
                          </Typography>
                        </li>
                      )
                    })}
                    </ol>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardMedia>
    </Card>
  );
}