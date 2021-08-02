import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, List, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs';

import AssignmentGrid from './AssignmentGrid';
import CohortDetailCards from '../shared/CohortDetailCards';
import StudentTimeline from './StudentTimeline';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '50ch',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '7px',
  },
  inline: {
    display: 'inline',
  },
}));

const CohortStudentActivity = ({ data, studentActivity, cohortData }) => {
  const classes = useStyles();
  const undeliveredAssignments = data.filter((assignment) => assignment.task_status === 'PENDING');
  const [listQuantity, setListQuantity] = useState(10);
  const {
    name, kickoff_date, ending_date, stage, teachers,
  } = cohortData;
  const startDate = dayjs(kickoff_date).format('MM-DD-YYYY');
  const endingDate = dayjs(ending_date).format('MM-DD-YYYY');
  let teachersArray;
  if (teachers) {
    const cohortTeacherArray = teachers.map((teacher) => {
      const { first_name, last_name, email } = teacher.user;
      return `${first_name} ${last_name} - ${email}`;
    });
    teachersArray = cohortTeacherArray;
  }

  const metrics = [
    {
      icon: 'colorize',
      value: name,
      title: 'Name',
    },
    {
      icon: 'colorize',
      value: startDate,
      title: 'Start Date',
    },
    {
      icon: 'colorize',
      value: endingDate,
      title: 'Ending Date',
    },
    {
      icon: 'colorize',
      value: stage,
      title: 'Stage',
    },
    {
      icon: 'colorize',
      value: teachersArray,
      title: 'Teachers',
    },
  ];

  return (
    <>
      <Grid item lg={3} md={3} sm={12} xs={12}>
        <div className="px-8">
          <CohortDetailCards metrics={metrics} />
        </div>
      </Grid>
      <StudentTimeline studentActivity={studentActivity} />
      <Grid item lg={3} md={3} sm={12} xs={12}>
        <List className={classes.root}>
          {undeliveredAssignments.slice(0, listQuantity).map((assignment, index) => (
            <AssignmentGrid
              key={assignment.id}
              data={assignment}
              classes={classes}
              isLastItem={undeliveredAssignments.length - 1 === index}
            />
          ))}
        </List>
        <div className="pt-4">
          <Button
            disabled={undeliveredAssignments.length < 10}
            fullWidth
            className="text-primary bg-light-primary"
            onClick={() => {
              setListQuantity(listQuantity + 10);
            }}
          >
            {undeliveredAssignments.length > 10 ? 'Load More' : 'No more projects to load'}
          </Button>
        </div>
      </Grid>
    </>
  );
};

CohortStudentActivity.propTypes = {
  data: PropTypes.object.isRequired,
  studentActivity: PropTypes.object.isRequired,
  cohortData: PropTypes.object.isRequired,
};

export default CohortStudentActivity;
