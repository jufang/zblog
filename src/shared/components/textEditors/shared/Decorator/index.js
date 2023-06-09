import React from 'react';
import PropTypes from 'prop-types';
import { Entity, CompositeDecorator } from 'draft-js';
import MultiDecorator from 'draft-js-multidecorators';
import PrismDecorator from 'draft-js-prism';
import styles from './styles';

const propTypes = {
  children: PropTypes.array,
  entityKey: PropTypes.string,
};

const Link = (props) => {
  const { url } = props.contentState.getEntity(props.entityKey).getData();

  return (
    <a href={url} className={styles.root}>
      {props.children}
    </a>
  );
};

Link.propTypes = propTypes;


function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      if (entityKey === null) {
        return false;
      }
      return Entity.get(entityKey).getType() === 'LINK'
    },
    callback
  );
}

export const decorator = new MultiDecorator([
  // default is javascript;
  new PrismDecorator({
    defaultSyntax: 'javascript',
  }),
  new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: Link,
    },
  ]),
]);
