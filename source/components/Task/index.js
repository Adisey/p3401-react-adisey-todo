// Core
import React, { PureComponent } from 'react';
import { string, func } from "prop-types";

// Instruments
import Styles from './styles.m.css';

export default class Task extends PureComponent {
    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    render () {
        const {
            message,
            completed,
            favorite,
            id,
        } = this.props;

        console.log(`Task # - `, message);
        // return <li className = { Styles.task }>Задача: стартовая точка</li>;
        return <li className = { Styles.task }>{id+' '+message}</li>;
    }
}
