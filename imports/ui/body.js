import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict'

import { Tasks } from '../api/tasks.js';
 
import './task.js';
import './body.html';
import './form.html';
 
Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
});
 
Template.body.helpers({
  tasks() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: false }, { sort: { createdAt: -1 } });
    }
    else {
      // Otherwise, return all of the tasks
      return Tasks.find({}, { sort: { createdAt: -1 } });
    }
  },
  incompleteCount() {
    return Tasks.find({ checked: false }).count();
  },
});

Template.body.events({
  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const text = target.text.value;
    const color = target.color.value;
 
    // Insert a task into the collection
    Tasks.insert({
      text: text,
      color: color,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
 
    // Clear form
    target.text.value = '';
    target.color.value = '';
  },
  'change .hide-completed input'(event, instance) {
    // Set a reactive variable
    instance.state.set('hideCompleted', event.target.checked);
  },
});