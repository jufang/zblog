import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import imageLogo from './image-icon.png';
import textLogo from './text-icon.png';
import styles from './styles';

const propTypes = {
  name: PropTypes.string.isRequired,
  handleAddItem: PropTypes.func.isRequired,
};

function getImage(name) {
  switch (name) {
    case 'ItemText':
      return textLogo;
    case 'ItemImage':
      return imageLogo;
    default:
      return;
  }
}

function EditBoxItem({ name, handleAddItem }) {
  return (
    <li className={styles.root}>
      <IconButton
        className={styles.button}
        onClick={() => handleAddItem(name)}
        disableTouchRipple
      >
        <img src={getImage(name)} alt={name} className={styles.icon} />
      </IconButton>
    </li>
  );
}

EditBoxItem.propTypes = propTypes;

export default EditBoxItem;
