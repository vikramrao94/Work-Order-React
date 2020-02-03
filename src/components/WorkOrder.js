import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';


const useStyles = makeStyles(theme => ({
  inline: {
    display: 'inline',
  },
  font: {
    fontSize: 10,
    display: 'inline-block'
  }
}));

const WorkOrder = (props) => {
  const classes = useStyles();
  return (
    <ListItem alignItems="flex-start" key = {props.index}>
    <ListItemAvatar>
      <Avatar alt={props.id} src={props.image} />
    </ListItemAvatar>
    <ListItemText
      primary={props.name +" - "+ props.company}
      secondary={
        <React.Fragment>
          <Typography
            component="span"
            variant="body2"
            className={classes.inline}
            color="textPrimary"
          >
            {props.workerName}
          </Typography>
          {"- "+props.description}

        </React.Fragment>
      }
    />
    <ListItemText
      primary={props.email}
      secondary={
        <React.Fragment>
          <Typography
            component="span"
            variant="body2"
            color="textPrimary"
            className = {classes.font}
          >
            {props.date}
          </Typography>
        </React.Fragment>
      }
    />

  </ListItem>
  );
}

export default WorkOrder;
