import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NavigationBar from 'cms/components/NavigationBar/index';
import Footer from 'shared/components/Footer/index';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MyRawTheme from 'shared/theme';
import styles from './styles';

const propTypes = {
  children: PropTypes.object,
};

class App extends Component {
  getChildContext() {
    return {
      muiTheme: getMuiTheme(MyRawTheme),
    };
  }

  render() {
    return (
      <div className={styles.root}>
        <NavigationBar />
        <div className={styles.container}>
          {this.props.children}
        </div>
        <Footer />
      </div>
    );
  }
}

App.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

App.propTypes = propTypes;

export default App;
