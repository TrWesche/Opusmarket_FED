import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from "react-redux";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Container,
  Grid,
  Typography,
  OutlinedInput,
  FormHelperText,
  FormControl,
  Button,
  Link,
  Snackbar
} from "@material-ui/core";

import {
  Alert
} from '@material-ui/lab';


import apiOpus from "../../../utils/apiOpusMarket";
import {CookiesContext} from "../../../contextProviders/CookiesContext";
import {
  MERCHANT_ACCOUNT_PROFILE_PATH
} from "../../../routes/_pathDict";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
  textField: {
    width: '25ch',
  },
}));

function UpdateMerchantForm() {
  const classes = useStyles();
  const history = useHistory();
  const {updateContextCookies} = useContext(CookiesContext);

  const currentUser = useSelector(store => store.currentUser);

  const [values, setValues] = useState({
    email: currentUser.email,
    display_name: currentUser.display_name
  });

  const [alertValues, setAlertValues] = useState({
    open: false,
    text: "",
    severity: "success"
  });

  const handleAlertClose = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertValues({...alertValues, open: false});
  };

  const renderAlert = () => {
    return (
      <Snackbar 
        open={alertValues.open} 
        autoHideDuration={6000} 
        onClose={handleAlertClose}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      >
        <Alert onClose={handleAlertClose} severity={alertValues.severity}>
          {alertValues.text}
        </Alert>
      </Snackbar>
    )
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiOpus.updateMerchantDetails(values);
      updateContextCookies('sid');

      history.push(MERCHANT_ACCOUNT_PROFILE_PATH);
    } catch (error) {
      if (error[0] && error[0].length > 0) {
        const errorText = error[0];
        setAlertValues({open: true, text: errorText, severity: "error"});
      } else {
        setAlertValues({open: true, text: "We encountered a problem, if this persists please contact support.", severity: "error"});
      }
    }
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    history.push(MERCHANT_ACCOUNT_PROFILE_PATH);
  };



  return (
    <Container>
      {renderAlert()}
      <Grid container spacing={2} className={classes.displayArea}>
        <Grid item xs={12}>
          <Typography className={classes.title} variant="h6" noWrap>
            Merchant Update Profile
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <form onSubmit={handleSubmit}>
            <Grid item xs={12}>
              <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
                <OutlinedInput
                  required
                  id="merchant-email"
                  value={values.email}
                  onChange={handleChange('email')}
                  aria-describedby="merchant-email-helper-text"
                  inputProps={{
                    'aria-label': 'email',
                  }}
                  labelWidth={0}
                />
                <FormHelperText id="merchant-email-helper-text">Email</FormHelperText>
              </FormControl>

              <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
                <OutlinedInput
                  required
                  id="merchant-displayname"
                  value={values.display_name}
                  onChange={handleChange('display_name')}
                  aria-describedby="merchant-displayname-helper-text"
                  inputProps={{
                    'aria-label': 'display name',
                  }}
                  labelWidth={0}
                />
                <FormHelperText id="merchant-displayname-helper-text">Display Name</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" aria-label="create merchant account" variant="contained" color="primary">
                  Update Profile
              </Button>
            </Grid>
          </form>
        </Grid>
        <Grid item xs={12}>
          <Link href="#" onClick={handleCancel}>Cancel</Link>
        </Grid>
      </Grid>
    </Container>
  );
}

export default UpdateMerchantForm;