import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import AppBar  from 'material-ui/AppBar'
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import AvWeb from 'material-ui/svg-icons/av/web';
import ActionDescription from 'material-ui/svg-icons/action/description';
import SocialPerson from 'material-ui/svg-icons/social/person';
import ActionExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import config from 'shared/config';
import { signOut } from 'cms/actions/auths';
import inlineStyles from 'shared/styles/MaterialUI/index';


class NavigationBar extends Component {

  constructor(props) {
    super(props);
  }

  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    return (
      <AppBar
        showMenuIconButton={false}
        title={config.authorName}
        style={inlineStyles.appBar.root}
        titleStyle={inlineStyles.appBar.title}
        onTitleTouchTap={()=> this.context.router.push('/cms')}
        zDepth={0}
        iconStyleRight={inlineStyles.appBar.elementRight}
        iconElementRight={
          <div>
            <IconMenu
              iconButtonElement={
                <IconButton name="about-button" disableTouchRipple={true} >
                  <SocialPerson color={inlineStyles.iconColor} />
                </IconButton>
              }
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              >
              <Link to="/cms/about/edit" >
                <MenuItem primaryText="编辑" />
              </Link>
              <Link to="/cms/about" >
                <MenuItem primaryText="预览" />
              </Link>
            </IconMenu>
            <Link to="/cms/posts" >
                <IconButton name="post-button" disableTouchRipple={true} >
                    <ActionDescription color={inlineStyles.iconColor} />
                </IconButton>
            </Link>
            <IconButton
              name="sign-out-button"
              disableTouchRipple={true}
              onClick={() => this.props.signOut()}
            >
              <ActionExitToApp color={inlineStyles.iconColor} />
            </IconButton>
          </div>
          }
      />

    );
  }
}

export default connect(null, { signOut })(NavigationBar);
