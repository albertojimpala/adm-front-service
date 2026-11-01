import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';

import {
  AccessScreen,
  AccountScreen,
  ClientsScreen,
  FilesScreen,
  RegimesScreen,
  ReportsScreen,
  RolesScreen,
  UsersScreen,
  BalancesScreen,
  InitialScreen,
} from '../../Screens';

const SubRouter = ({ match: { url }, locations }) => {
  return (
    <Switch>
      <Route
        component={AccessScreen}
        exact
        location={locations}
        path={`${url}/access`}
      />
      <Route
        component={AccountScreen}
        exact
        location={locations}
        path={`${url}/accounts`}
      />
      <Route
        component={UsersScreen}
        exact
        location={locations}
        path={`${url}/users`}
      />
      <Route
        component={InitialScreen}
        exact
        location={locations}
        path={`${url}`}
      />
      <Route
        component={RegimesScreen}
        exact
        location={locations}
        path={`${url}/regimes`}
      />
      <Route
        component={RolesScreen}
        exact
        location={locations}
        path={`${url}/roles`}
      />
      <Route
        component={ClientsScreen}
        exact
        location={locations}
        path={`${url}/clients`}
      />
      <Route
        component={FilesScreen}
        exact
        location={locations}
        path={`${url}/files`}
      />
      <Route
        component={BalancesScreen}
        exact
        location={locations}
        path={`${url}/balances`}
      />
      <Route
        component={ReportsScreen}
        exact
        location={locations}
        path={`${url}/reports`}
      />
    </Switch>
  );
};

SubRouter.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }),
  locations: PropTypes.object,
};

export default withRouter(SubRouter);
