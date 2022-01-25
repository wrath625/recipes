import React from 'react';
import { Formik, Field, FieldArray, Form } from 'formik';
import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import { Autocomplete } from 'formik-material-ui-lab';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import { Button, LinearProgress, Paper, Grid, InputAdornment, Avatar, 
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import MuiTextField from '@material-ui/core/TextField'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import ImageIcon from '@material-ui/icons/Image';
import SaveIcon from '@material-ui/icons/Save';
import AccountCircle from '@material-ui/icons/AccountCircle';
import DescriptionIcon from '@material-ui/icons/Description';
import TimerIcon from '@material-ui/icons/Timer';
import SnoozeIcon from '@material-ui/icons/Snooze';
import TitleIcon from '@material-ui/icons/Title';
import * as Yup from 'yup';
import axios from "axios";

class Thumb extends React.Component {

  render() {
    const { file } = this.props;

    if (!file) { return null; }

    return (<img src={this.props.file}
      alt={file.name}
      className="img-thumbnail mt-2"
      height={200}
      width="auto" />);
  }
}

const filter = createFilterOptions();

const useStyles = makeStyles((theme) => ({
  paperOuter: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
  },
  avatarSmall: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    backgroundColor: "rgba(0, 0, 0, 0.87)"
  },
  error: {
    color: theme.palette.error.main,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const RecipeForm = (props) => {
  const classes = useStyles();
  const [keywordsDialogOpen, toggleKeywordsDialogOpen] = React.useState(false);
  const [foodDialogOpen, toggleFoodDialogOpen] = React.useState(false);
  const [unitDialogOpen, toggleUnitDialogOpen] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSuccessClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSuccess(false);
  };
  const handleErrorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setError(false);
  };

  const ref = React.useRef();

  const handleKeywordsDialogClose = () => {
    ref.current.setFieldValue('keywordsDialogName', '')
    ref.current.setFieldValue('keywordsDialogDescription', '')
    toggleKeywordsDialogOpen(false);
  };

  const handleKeywordsDialogSubmit = () => {
    ref.current.setFieldValue('keywords', [
      ...ref.current.values.keywords,
      {
      name: ref.current.values.keywordsDialogName,
      description: ref.current.values.keywordsDialogDescription,
    }], false);

    handleKeywordsDialogClose();
  };

  const handleFoodDialogClose = () => {
    ref.current.setFieldValue('foodDialogName', '')
    ref.current.setFieldValue('foodDialogIgnoreShopping', false)
    ref.current.setFieldValue('foodDialogDescription', '')
    toggleFoodDialogOpen(false);
  };

  const handleFoodDialogSubmit = (name) => {
    ref.current.setFieldValue(name, {
      name: ref.current.values.foodDialogName,
      ignoreShopping: ref.current.values.foodDialogIgnoreShopping,
      description: ref.current.values.foodDialogDescription,
    }, false);

    handleFoodDialogClose();
  };

  const handleUnitDialogClose = () => {
    ref.current.setFieldValue('unitDialogName', '')
    ref.current.setFieldValue('unitDialogDescription', '')
    toggleUnitDialogOpen(false);
  };

  const handleUnitDialogSubmit = (name) => {
    ref.current.setFieldValue(name, {
      name: ref.current.values.unitDialogName,
      description: ref.current.values.unitDialogDescription,
    }, false);

    handleUnitDialogClose();
  };

  function convertObjectValuesRecursive(obj, target, replacement) {
    obj = {...obj};
    Object.keys(obj).forEach((key) => {
      if (obj[key] === target) {
        obj[key] = replacement;
      } else if (typeof obj[key] == 'object' && !Array.isArray(obj[key])) {
        obj[key] = convertObjectValuesRecursive(obj[key], target, replacement);
      }
    });
    return obj;
  }

  let initialValues = {
    name: '',
    image: null,
    servings: '',
    servingsText: '',
    createdBy: '',
    workingTime: '',
    waitingTime: '',
    keywords: [],
    description: '',
    steps: [
      {
        name: '',
        order: 1,
        ingredients: [
          {
            food: { name: ''},
            foodNote: '',
            unit: { name: null},
            unitNote: '',
            amount: '',
            amountInG: '',
            primary: false,
            optional: false,
            order: 1
          }
        ],
        procedures: [
          {
            description: '',
            order: 1
          }
        ],
      }
    ],
    keywordsDialogName: '',
    keywordsDialogDescription: '',
    foodDialogName: '',
    foodDialogDescription: '',
    foodDialogIgnoreShopping: false,
    unitDialogName: '',
    unitDialogDescription: '',
    
  }

  if (props.recipes) {
    let recipe = convertObjectValuesRecursive(props.recipes[0], null, '')
    if (props.recipes) {
      initialValues = {
        ...initialValues,
        ...recipe
      }
    }
  }

  return (
    <React.Fragment>
    <Snackbar open={success} autoHideDuration={6000} onClose={handleSuccessClose}>
      <Alert onClose={handleSuccessClose} severity="success">
        Success!
      </Alert>
    </Snackbar>
    <Snackbar open={error} autoHideDuration={6000} onClose={handleErrorClose}>
      <Alert onClose={handleErrorClose} severity="error">
        {errorMessage}
      </Alert>
    </Snackbar>
    <Formik
      innerRef={ref}
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={
        Yup.object({
          name: Yup.string()
            .max(128, 'Must be 128 characters or less')
            .required('Required'),
          image: Yup.string()
            .nullable(),
          servings: Yup.number()
            .positive('Must be a positive integer')
            .min(1, 'Must yield at least 1 unit')
            .integer('Must an integer not a decimal number')
            .required('Required'),
          servingsText: Yup.string()
            .max(32, 'Must be 32 characters or less'),
          createdBy: Yup.string()
            .max(128, 'Must be 128 characters or less')
            .required('Required'),
          workingTime: Yup.number()
            .positive('Must be a positive integer')
            .min(1, 'Must take at least 1 minute')
            .integer('Must an integer not a decimal number')
            .required('Required'),
          waitingTime: Yup.number()
            .min(0, 'Cannot be a negative number')
            .integer('Must an integer not a decimal number')
            .required('Required'),
          keywords: Yup.array()
            .of(Yup.object(
              {
                name: Yup.string()
                  .required('Required')
              }
            )),
          description: Yup.string()
            .min(12, 'Please write something of substance to describe this recipe')
            .required('Required'),
          steps: Yup.array()
            .min(1, "A recipe requires at least one step.")
            .of(
              Yup.object(
                {
                  name: Yup.string()
                    .max(128, 'Must be 128 characters or less')
                    .nullable(),
                  order: Yup.number(),
                  ingredients: Yup.array()
                  .of(
                    Yup.object(
                      {
                        food: Yup.object()
                          .test('is-empty', 'Required',
                          (value, context) => value.name !== undefined),
                        foodNote: Yup.string().nullable(),
                        unit: Yup.object().nullable(),
                          // .test('is-empty', 'Required',
                          // (value, context) => value.name !== undefined),
                        unitNote: Yup.string().nullable(),
                        amount: Yup.number()                          
                          .required('Required'),
                        amountInG: Yup.number().nullable(),
                        primary: Yup.boolean(),
                        optional: Yup.boolean(),
                        order: Yup.number()
                      }
                    )
                  ),
                procedures: Yup.array()
                  .of(
                    Yup.object(
                      {
                        description: Yup.string()
                          .required('Required'),
                        order: Yup.number()
                      }
                    )
                  ),
                }
              )
            )
        })
      }
      onSubmit={(values, { setSubmitting }) => {
        console.log(values)
        // blow away the dialog values
        delete(values.keywordsDialogName)
        delete(values.keywordsDialogDescription)
        delete(values.foodDialogName)
        delete(values.foodDialogIgnoreShopping)
        delete(values.foodDialogDescription)
        delete(values.unitDialogName)
        delete(values.unitDialogDescription)

        if (values.image && values.image.substring(0, 4) !== "data") {
          delete(values.image)
        }

        if (!props.recipes) {
          axios
            .post("/api/recipes/",
            values)
            .then(function (response) {
              setSuccess(true);
              console.log(response);
            })
            .catch((err) => {            
              console.log(err)
              setErrorMessage(err.response.request.response)
              setError(true)
            });
        } else {
          axios
            .put("/api/recipes/" + props.recipes[0].slug + "/",
            values)
            .then(function (response) {
              setSuccess(true);
              console.log(response);
            })
            .catch((err) => {
              console.log(err)
              setErrorMessage(err.response.request.response)
              setError(true)
            });
        }
        setSubmitting(false);
      }}
      >
      {({ values, submitForm, isSubmitting, setFieldValue, touched, errors }) => (
      <Paper className={classes.paperOuter}>
        <Form>
        <Grid container alignItems="flex-start" spacing={2}>
          <Grid item sm={6} xs={12}>
            <Field
              autoFocus
              component={TextField}
              name="name"
              type="text"
              fullWidth
              label="Recipe Title *"
              helperText="The name of your masterpiece"
              variant="filled"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TitleIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item sm={6} xs={12} style={{"justifyContent": "center", "alignItems":"center"}} >
            <Field 
              component={TextField}
              name="createdBy"
              fullWidth
              type="text"
              label="Entered By *"
              placeholder="Your name"
              helperText="Recipe author / inputter"
              variant="filled"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              size="large"
              disableElevation
              startIcon={<ImageIcon />}
            >
              Upload Image
              <input
                accept="image/*"
                type="file"
                name="image"
                hidden
                onChange={(event) => {
                  var file = event.currentTarget.files[0];
                  const reader = new FileReader();
                  reader.readAsDataURL(file);

                  reader.onloadend = function(e) {
                    setFieldValue("image", reader.result)
                  }
                }}
              />
            </Button>            
          </Grid>

          <Grid item xs={12}>
            {props.recipes ? (<img src={values.image} alt={values.name} height={200} width="auto" />) : (<Thumb file={values.image} />)}       
          </Grid>

          <Grid item lg={3} md={6} xs={6}>
            <Field 
              component={TextField}
              name="servings"
              fullWidth
              type="text"
              label="Serving Amount *"
              placeholder="12"
              helperText="Amount of units the recipe creates"
              variant="filled"
            />
          </Grid>

          <Grid item lg={3} md={6} xs={6}>
            <Field 
              component={TextField}
              name="servingsText"
              fullWidth
              type="text"
              label="Serving Descriptor"
              placeholder="Cups"
              helperText="(Optional) type of unit the recipe creates"
              variant="filled"
            />
          </Grid>

          <Grid item lg={3} xs={6}>
            <Field 
              component={TextField}
              name="workingTime"
              fullWidth
              type="text"
              label="Working Time *"
              placeholder="30"
              helperText="Time in minutes spent working"
              variant="filled"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TimerIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item lg={3} xs={6}>
            <Field 
              component={TextField}
              name="waitingTime"
              fullWidth
              type="text"
              label="Waiting Time *"
              placeholder="30"
              helperText="Time in minutes spent waiting"
              variant="filled"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SnoozeIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Field
              name="keywords"
              multiple
              component={Autocomplete}

              options={props.keywords}
              onChange={(event, newValue) => {
                if (Array.isArray(newValue) && newValue.length > 0 && newValue[newValue.length - 1].inputValue) {
                  setTimeout(() => {
                    toggleKeywordsDialogOpen(true);
                    setFieldValue('keywordsDialogName', newValue[newValue.length - 1].inputValue)
                    setFieldValue('keywordsDialogDescription', '')
                  });
                } else {
                  setFieldValue('keywords', newValue);
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
      
                if (params.inputValue !== '') {
                  filtered.push({
                    inputValue: params.inputValue,
                    name: `Add "${params.inputValue}"`,
                  });
                }
      
                return filtered;
              }}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => option.name}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              freeSolo
              renderInput={(params) => (
                <MuiTextField
                  {...params}
                  name="keywords"
                  error={touched['keywords'] && !!errors['keywords']}
                  helperText={(touched['keywords'] && errors['keywords']) || "Keywords used to search for this recipe"}
                  label="Keywords"
                  variant="filled"
                />
              )}
            />            
            <Dialog open={keywordsDialogOpen} onClose={handleKeywordsDialogClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Add a new keyword</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Didn't find the keyword you were looking for? Please, add it!
                </DialogContentText>
                <Grid container alignItems="flex-start" spacing={2}>
                  <Grid item xs={12}>
                    <Field 
                      autoFocus
                      fullWidth
                      component={TextField}
                      name="keywordsDialogName"
                      label="Name *"
                      type="text"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field 
                      fullWidth
                      component={TextField}
                      name="keywordsDialogDescription"
                      label="Description"
                      type="text"
                    />
                </Grid>
              </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleKeywordsDialogClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleKeywordsDialogSubmit} color="primary">
                  Add
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>

          <Grid item xs={12}>
            <Field 
              component={TextField}
              multiline
              fullWidth
              rows={4}
              name="description"
              type="text"
              label="Recipe Description *"
              variant="filled"
              helperText="The description of your masterpiece"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        <FieldArray
          name="steps"
          render={arrayHelpers => (
            <Grid container alignItems="flex-start" spacing={2}>
              <Grid item xs={12}>
                <React.Fragment>
                {values.steps && values.steps.length > 0 && (
                  values.steps.map((step, stepIndex) => (
                  <Paper variant="outlined" className={classes.paper} key={stepIndex}>
                    <Grid container alignItems="flex-start" spacing={2} >
                      <Grid item xs={12}>
                        <Field 
                          component={TextField}
                          name={`steps[${stepIndex}].name`}
                          label="Step Name"
                          helperText="(Optional) descriptor for this step block"
                          variant="filled"
                        />
                        <Field 
                          name={`steps[${stepIndex}].order`}
                          type="hidden"
                        />
                        <FieldArray
                          name={`steps[${stepIndex}].ingredients`}
                          render={ingredientHelpers => (
                            <React.Fragment>
                              <Paper elevation={1} className={classes.paper}>
                              {values.steps[stepIndex].ingredients && values.steps[stepIndex].ingredients.length > 0 && (
                                values.steps[stepIndex].ingredients.map((ingredient, ingredientIndex) => (
                                  <Grid container alignItems="flex-start" spacing={2} key={ingredientIndex}>
                                    <Grid item lg={3} md={3} sm={12} xs={12}>                                      
                                      <Field
                                        name={`steps[${stepIndex}].ingredients[${ingredientIndex}].food`}
                                        component={Autocomplete}
                                        options={props.foods}
                                        onChange={(event, newValue) => {
                                          if (typeof newValue === 'object' && newValue && newValue.inputValue) {
                                            setTimeout(() => {
                                              toggleFoodDialogOpen(true);
                                              setFieldValue('foodDialogName', newValue.inputValue)
                                              setFieldValue('foodDialogDescription', '')
                                            });
                                          } else {
                                            setFieldValue(`steps[${stepIndex}].ingredients[${ingredientIndex}].food`, newValue);
                                          }
                                        }}
                                        filterOptions={(options, params) => {
                                          const filtered = filter(options, params);
                                
                                          if (params.inputValue !== '') {
                                            filtered.push({
                                              inputValue: params.inputValue,
                                              name: `Add "${params.inputValue}"`,
                                            });
                                          }
                                
                                          return filtered;
                                        }}
                                        getOptionSelected={(option, value) => option.name === value.name}
                                        getOptionLabel={(option) => option.name}
                                        selectOnFocus
                                        handleHomeEndKeys
                                        freeSolo
                                        renderInput={(params) => (
                                          <MuiTextField                                            
                                            {...params}
                                            name={`steps[${stepIndex}].ingredients[${ingredientIndex}].food`}                                            
                                            error={
                                              touched.steps &&
                                              touched.steps[stepIndex] > 0 &&
                                              touched.steps[stepIndex].ingredients &&
                                              touched.steps[stepIndex].ingredients[ingredientIndex] &&
                                              touched.steps[stepIndex].ingredients[ingredientIndex].food &&
                                              errors.steps &&
                                              errors.steps[stepIndex] &&
                                              errors.steps[stepIndex].ingredients &&
                                              errors.steps[stepIndex].ingredients[ingredientIndex] &&
                                              !!errors.steps[stepIndex].ingredients[ingredientIndex].food
                                            }
                                            helperText={
                                              touched.steps &&
                                              touched.steps[stepIndex] > 0 &&
                                              touched.steps[stepIndex].ingredients &&
                                              touched.steps[stepIndex].ingredients[ingredientIndex] &&
                                              touched.steps[stepIndex].ingredients[ingredientIndex].food &&
                                              errors.steps &&
                                              errors.steps[stepIndex] &&
                                              errors.steps[stepIndex].ingredients &&
                                              errors.steps[stepIndex].ingredients[ingredientIndex] &&
                                              errors.steps[stepIndex].ingredients[ingredientIndex].food
                                            }
                                            label="Ingredient Name *"
                                            variant="filled"
                                          />
                                        )}
                                      />                                      
                                      <Dialog open={foodDialogOpen} onClose={handleFoodDialogClose} aria-labelledby="form-dialog-title">
                                        <DialogTitle id="form-dialog-title">Add a new food</DialogTitle>
                                        <DialogContent>
                                          <DialogContentText>
                                            Didn't find the food you were looking for? Please, add it!
                                          </DialogContentText>
                                          <Grid container alignItems="flex-start" spacing={2}>
                                            <Grid item xs={12}>
                                              <Field 
                                                autoFocus
                                                fullWidth
                                                component={TextField}
                                                name="foodDialogName"
                                                label="Name *"
                                                type="text"
                                              />
                                            </Grid>
                                            <Grid item xs={12}>
                                              <Field 
                                                fullWidth
                                                component={TextField}
                                                name="foodDialogDescription"
                                                label="Description"
                                                type="text"
                                              />
                                          </Grid>
                                          <Grid item xs={12}>
                                            <Field
                                              component={CheckboxWithLabel}
                                              type="checkbox"
                                              name="foodDialogIgnoreShopping"
                                              Label={{ label: 'Ignore when adding to a Shopping List?' }}
                                            />
                                          </Grid>
                                        </Grid>
                                        </DialogContent>
                                        <DialogActions>
                                          <Button onClick={handleFoodDialogClose} color="primary">
                                            Cancel
                                          </Button>
                                          <Button onClick={() => handleFoodDialogSubmit(`steps[${stepIndex}].ingredients[${ingredientIndex}].food`)} color="primary">
                                            Add
                                          </Button>
                                        </DialogActions>                                    
                                      </Dialog>                                      
                                    </Grid>

                                    <Grid item lg={3} md={3} sm={6} xs={12}>
                                      <Field 
                                        component={TextField}
                                        fullWidth
                                        name={`steps[${stepIndex}].ingredients[${ingredientIndex}].foodNote`}
                                        label="Ingredient Note"
                                        helperText="(Optional) ingredient properties"
                                        placeholder="5 ºC / 41 ºF"
                                        variant="filled"
                                      />
                                    </Grid>

                                    <Grid item lg={2} md={2} sm={6} xs={12}>
                                      <Field 
                                        component={TextField}
                                        fullWidth
                                        name={`steps[${stepIndex}].ingredients[${ingredientIndex}].amount`}
                                        label="Amount *"
                                        placeholder="300.00"
                                        variant="filled"
                                        helperText="Ingredient measurement"
                                      />
                                    </Grid>

                                    <Grid item lg={2} md={2} sm={6} xs={12}>
                                      <Field
                                        name={`steps[${stepIndex}].ingredients[${ingredientIndex}].unit`}
                                        component={Autocomplete}
                                        options={props.units}
                                        onChange={(event, newValue) => {
                                          if (typeof newValue === 'object' && newValue && newValue.inputValue) {
                                            setTimeout(() => {
                                              toggleUnitDialogOpen(true);
                                              setFieldValue('unitDialogName', newValue.inputValue)
                                              setFieldValue('unitDialogDescription', '')
                                            });
                                          } else {
                                            setFieldValue(`steps[${stepIndex}].ingredients[${ingredientIndex}].unit`, newValue);
                                          }
                                        }}
                                        filterOptions={(options, params) => {
                                          const filtered = filter(options, params);
                                
                                          if (params.inputValue !== '') {
                                            filtered.push({
                                              inputValue: params.inputValue,
                                              name: `Add "${params.inputValue}"`,
                                            });
                                          }
                                
                                          return filtered;
                                        }}
                                        getOptionSelected={(option, value) => option.name === value.name}
                                        getOptionLabel={(option) => option.name ? option.name : ''}
                                        selectOnFocus
                                        handleHomeEndKeys
                                        freeSolo
                                        renderInput={(params) => (
                                          <MuiTextField
                                            {...params}
                                            name={`steps[${stepIndex}].ingredients[${ingredientIndex}].unit`}  
                                            error={
                                              touched.steps &&
                                              touched.steps[stepIndex] &&
                                              touched.steps[stepIndex].ingredients &&
                                              touched.steps[stepIndex].ingredients[ingredientIndex] &&
                                              touched.steps[stepIndex].ingredients[ingredientIndex].unit &&
                                              errors.steps &&
                                              errors.steps[stepIndex] &&
                                              errors.steps[stepIndex].ingredients &&
                                              errors.steps[stepIndex].ingredients[ingredientIndex] &&
                                              !!errors.steps[stepIndex].ingredients[ingredientIndex].unit
                                            }
                                            helperText={
                                              touched.steps &&
                                              touched.steps[stepIndex] &&
                                              touched.steps[stepIndex].ingredients &&
                                              touched.steps[stepIndex].ingredients[ingredientIndex] &&
                                              touched.steps[stepIndex].ingredients[ingredientIndex].unit &&
                                              errors.steps &&
                                              errors.steps[stepIndex] &&
                                              errors.steps[stepIndex].ingredients &&
                                              errors.steps[stepIndex].ingredients[ingredientIndex] &&
                                              errors.steps[stepIndex].ingredients[ingredientIndex].unit
                                            }                                            
                                            label="Unit *"
                                            variant="filled"
                                          />
                                        )}
                                      />
                                      <Dialog open={unitDialogOpen} onClose={handleUnitDialogClose} aria-labelledby="form-dialog-title">
                                        <DialogTitle id="form-dialog-title">Add a new unit</DialogTitle>
                                        <DialogContent>
                                          <DialogContentText>
                                            Didn't find the measurement unit you were looking for? Please, add it!
                                          </DialogContentText>
                                          <Grid container alignItems="flex-start" spacing={2}>
                                            <Grid item xs={12}>
                                              <Field 
                                                autoFocus
                                                fullWidth
                                                component={TextField}
                                                name="unitDialogName"
                                                label="Name *"
                                                type="text"
                                              />
                                            </Grid>
                                            <Grid item xs={12}>
                                              <Field 
                                                fullWidth
                                                component={TextField}
                                                name="unitDialogDescription"
                                                label="Description"
                                                type="text"
                                              />
                                          </Grid>
                                        </Grid>
                                        </DialogContent>
                                        <DialogActions>
                                          <Button onClick={handleUnitDialogClose} color="primary">
                                            Cancel
                                          </Button>
                                          <Button onClick={() => handleUnitDialogSubmit(`steps[${stepIndex}].ingredients[${ingredientIndex}].unit`)} color="primary">
                                            Add
                                          </Button>
                                        </DialogActions>                                    
                                      </Dialog>
                                    </Grid>

                                    <Grid item lg={2} md={2} sm={6} xs={12}>
                                      <Field 
                                        component={TextField}
                                        fullWidth
                                        name={`steps[${stepIndex}].ingredients[${ingredientIndex}].unitNote`}
                                        label="Unit Note"
                                        helperText="(Optional) unit properties"
                                        placeholder="one drop"
                                        variant="filled"
                                      />
                                    </Grid>

                                    <Grid item sm={6} xs={12}>
                                      <Field
                                        component={CheckboxWithLabel}
                                        type="checkbox"
                                        name={`steps[${stepIndex}].ingredients[${ingredientIndex}].primary`}
                                        Label={{ label: 'Primary Ingredient' }}
                                      />
                                      <Field
                                        component={CheckboxWithLabel}
                                        type="checkbox"
                                        name={`steps[${stepIndex}].ingredients[${ingredientIndex}].optional`}
                                        Label={{ label: 'Optional' }}
                                      />
                                    </Grid>
                                    <Grid item sm={6} xs={12}>
                                      <Field 
                                        fullWidth
                                        component={TextField}
                                        name={`steps[${stepIndex}].ingredients[${ingredientIndex}].amountInG`}
                                        label="Amount in Grams"
                                        placeholder="12.20"
                                        variant="filled"
                                        helperText="Ingredient amount in grams"
                                        InputProps={{
                                          startAdornment: <InputAdornment position="start">g</InputAdornment>,
                                        }}
                                      />
                                    </Grid>

                                    <Grid item xs={12} style={{"textAlign":"right"}}>
                                      <Field 
                                        name={`steps[${stepIndex}].ingredients[${ingredientIndex}].order`}
                                        type="hidden"
                                      />
                                      <Button
                                        type="button"
                                        startIcon={<RemoveIcon />}
                                        onClick={() => ingredientHelpers.remove(ingredientIndex)}
                                      >
                                      Remove Ingredient
                                      </Button>
                                    </Grid>
                                  </Grid>
                                ))
                            )}
                            </Paper>
                            <Button color="primary" type="button" startIcon={<AddIcon />} onClick={() => ingredientHelpers.push(
                              {
                                "food": { name: '' },
                                "foodNote": '',
                                "unit": { name: ''},
                                "unitNote": '',
                                "amount": '',
                                "primary": false,
                                "optional": false,
                                "order": values.steps[stepIndex].ingredients ? values.steps[stepIndex].ingredients.length + 1 : 1
                              })}>
                              Add an Ingredient
                            </Button>

                          </React.Fragment>
                          )}
                        />
                        <FieldArray
                          name={`steps[${stepIndex}].procedures`}
                          render={procedureHelpers => (
                            <React.Fragment>
                              {values.steps[stepIndex].procedures && values.steps[stepIndex].procedures.length > 0 && (
                                values.steps[stepIndex].procedures.map((procedure, procedureIndex) => (
                                  <Paper elevation={1} className={classes.paper} key={procedureIndex}>                                
                                    <Grid container alignItems="flex-start" spacing={2} >
                                      <Grid item xs={12}>
                                        <Field 
                                          component={TextField}
                                          fullWidth
                                          name={`steps[${stepIndex}].procedures[${procedureIndex}].description`}
                                          label="Procedure Description *"
                                          variant="filled"
                                          InputProps={{
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                <Avatar className={classes.avatarSmall}>{procedureIndex + 1}</Avatar>
                                              </InputAdornment>
                                            ),
                                          }}
                                        />
                                      </Grid>

                                      <Grid item xs={12} style={{"textAlign":"right"}}>
                                        <Field 
                                          name={`steps[${stepIndex}].procedures[${procedureIndex}].order`}
                                          type="hidden"
                                        />
                                        <Button
                                          type="button"
                                          startIcon={<RemoveIcon />}
                                          onClick={() => procedureHelpers.remove(procedureIndex)}
                                        >
                                        Remove Procedure
                                        </Button>
                                      </Grid>
                                    </Grid>
                                  </Paper>
                                ))
                            )}
                            <Button type="button" color="primary" startIcon={<AddIcon />} onClick={() => procedureHelpers.push({"description": '', "order": values.steps[stepIndex].procedures ? values.steps[stepIndex].procedures.length + 1 : 1})}>
                              Add a Procedure
                            </Button>
                          </React.Fragment>
                          )}
                        />
                    </Grid>
                    <Grid item xs={12} style={{"textAlign":"right"}}>
                        <Button
                          type="button"
                          startIcon={<RemoveIcon />}
                          onClick={() => arrayHelpers.remove(stepIndex)}
                        >
                        Remove Step
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                  ))
                )}
                </React.Fragment>
              </Grid>
              <Grid item xs={12}>
                <Button type="button" color="primary" startIcon={<AddIcon />} onClick={() => arrayHelpers.push(
                  {
                    "name": '',
                    "order": values.steps.length + 1,
                    "ingredients": [
                      {
                        "food": { name: '' },
                        "foodNote": '',
                        "unit": { name: '' },
                        "unitNote": '',
                        "amount": '',
                        "primary": false,
                        "optional": false,
                        "order": 1
                      }
                    ],
                    "procedures": [
                      {
                        "description": '',
                        "order": 1
                      }
                    ]
                  })}>
                  Add a Step
                </Button>
                <div className={classes.error}>{values.steps.length === 0 && errors.steps}</div>
              </Grid>
            </Grid>
          )}
        />
        <Grid container alignItems="flex-start" spacing={2} >
          <Grid item xs={12}>
            {isSubmitting && <LinearProgress />}
            {touched && Object.keys(errors).length > 0 && <Alert severity="error">Your submission has errors! <br /> DEBUG: {JSON.stringify(errors, null, 4)}</Alert>}
          </Grid>
          <Grid item xs={12} style={{"textAlign": "right"}}>
            
            <Button
              variant="contained"
              color="primary"
              disabled={Object.keys(errors).length > 0 || isSubmitting}
              onClick={submitForm}
              startIcon={<SaveIcon />}
            >
              {!props.recipes ? ( "Save" ) : ( "Update" )}
            </Button>
          </Grid>
        </Grid>
      </Form>
      </Paper>
    )}
    </Formik>
    </React.Fragment>
  );
};

export default RecipeForm