import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';

import WorkOrder from './WorkOrder';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: theme.palette.background.paper,
  },
  formControl: {
    margin: theme.spacing(3),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
});

const date = (epoch) => {
  let d = new Date(0);
  d.setUTCSeconds(epoch);
  return d.toString();
}

const filterByValue = (array, string) => {
  return array.filter(item =>
        item["worker"]["name"].toLowerCase().includes(string.toLowerCase()));
}

const fetchAll = async (urls) => {
    try {
      let result = await Promise.all(
        urls.map(url => fetch(url)
          .then(r => r.json())
          .catch(error => ({ error, url }))
        )
      )
      const modified = {}
      result.forEach(item => {
        modified[item.worker.id] = item.worker;
      });
      return modified;

    } catch (err) {
      console.log(err)
      return []
    }
}

class WorkOrderList extends Component {

  constructor(props) {
    super(props);
      this.state = {
        results:[],
        filterResults:[],
        toggle: 'asc',
        text:''
      };
  }

  componentDidMount = () => {
    this.getWorkOrders();
  }

  getWorkOrders = async () => {
    const res = await fetch('https://www.hatchways.io/api/assessment/work_orders');
    const results = await res.json();
    const workerIds = new Set();
    results.orders.forEach(item => {
      workerIds.add(item.workerId);
    });
    const ids = [...workerIds];
    const urls = [];
    ids.forEach(id => {
      urls.push(`https://www.hatchways.io/api/assessment/workers/${id}`);
    });
    let workerInfo = await fetchAll(urls);
    if (workerInfo.length !== 0) {
      results.orders.forEach(item => {
        item["worker"] = workerInfo[item["workerId"]];
      });
    }
    this.sort(results["orders"])
  }

  sort = (items) => {
    const results = items !== undefined ? items : this.state.results;
    if (this.state.toggle === 'asc') {
      results.sort((a,b) =>
        a.deadline - b.deadline
      )
    }
    else {
      results.sort((a,b) =>
        b.deadline - a.deadline
      )
    }
    this.setState({
      results:results,
      filterResults:items !== undefined ? results : this.state.filterResults
    })
  }

  handleToggle = (event) => {
    this.setState({
      toggle:event.target.value
    }, () => {
      this.sort();
    })
  }

  handleInputChange = (event) => {
    this.setState({
      text:event.target.value,
      toggle:''
    },() => {
      let results = []
      if (this.state.text !== '') {
        results = filterByValue(this.state.filterResults,this.state.text);
      } else {
        results = this.state.filterResults;
      }
      this.setState({
        results:results
      })
    })
  }

  renderList = () => {
    const {classes} = this.props;
    let results = this.state.results;
    let list = results.map((data,index) => {
      return (
        <WorkOrder
          image = {data.worker.image}
          name = {data.name}
          description = {data.description}
          workerName = {data.worker.name}
          company = {data.worker.companyName}
          email = {data.worker.email}
          date = {date(data.deadline)}
          index = {index}
          id = {data.id}
        />
      )
    });
    return list;
  }

  render() {
    const {classes} = this.props;
    return(
      <div>
      <TextField
          id="outlined-basic"
          className={classes.textField}
          label="Search Name"
          margin="normal"
          variant="outlined"
          value={this.state.text}
          onChange={this.handleInputChange}
        />

      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Order By</FormLabel>
        <RadioGroup aria-label="Order by" name="toggle" value={this.state.toggle} onChange={this.handleToggle}>
          <FormControlLabel value="asc" control={<Radio />} label="Earliest First" />
          <FormControlLabel value="dsc" control={<Radio />} label="Latest First" />
        </RadioGroup>
      </FormControl>
      {
        this.state.results.length !== 0 ?
        <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              style={{ minHeight: '10vh' }}
            >
        <List component="nav"  className ={classes.root}>
            {this.renderList()}
        </List>
        </Grid>
        :
        null
      }
      </div>
    )
  }
}

WorkOrderList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(WorkOrderList);
