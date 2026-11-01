import React from 'react';
import { Switch } from 'react-router-dom';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ProtectedRoute from './ProtectedRoute';
import Login from '../App';
import { Dashboard } from '../Screens';
import { VerifyScreen } from '../Screens/Verify';

const Router = ({ token }) => {
  return (
    <Switch>
      <ProtectedRoute
        exact
        path="/"
        component={Login}
        token={token === '' ? '1' : ''}
        redirect={{
          pathname: 'dashboard',
          state: {
            key: 'dashboard',
          },
        }}
      />
      <ProtectedRoute component={Dashboard} path="/dashboard" token={token} />
      <ProtectedRoute
        exact
        path="/verify/:token"
        component={VerifyScreen}
        token={token === '' ? '1' : ''}
        redirect={{
          pathname: 'dashboard',
          state: {
            key: 'dashboard',
          },
        }}
      />
    </Switch>
  );
};

const mapStateStore = state => {
  return {
    token: state.auth.token,
    location: state.router.location,
  };
};

const mapStateFunc = { navigatePush: push };

Router.propTypes = {
  location: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

export default connect(mapStateStore, mapStateFunc)(Router);
