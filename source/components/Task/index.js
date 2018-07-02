// Core
import React, { PureComponent } from 'react';
import { string, func } from "prop-types";

// Instruments
import Styles from './styles.m.css';
import Star from '../../theme/assets/Star';
// import Edit from '../../theme/assets/Edit';
import Remove from '../../theme/assets/Remove';

export default class Task extends PureComponent {
    static propTypes = {
        _favoriteTaskAsync: func.isRequired,
        _removeTasktAsync:  func.isRequired,
    };

    //     uneditable: true,
    //

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

    _getFavorite = () => {
        const {
            favorite,
        } = this.props;

        console.log(`Favorite - `, favorite);
        console.log(`this.props`, this.props);

        return (
            <span
                className = { Styles.toggleTaskFavoriteState }
                onClick = { this._favoriteTask }>
                <Star />
                {favorite?<Star />:null}
            </span>
        );
    };
    _favoriteTask = () => {
        console.log(`Click Favorite`);
        const { _favoriteTaskAsync, id } = this.props;

        _favoriteTaskAsync(id);
    };
    _getRemoveTask = () => {
        return (
            <span
                onClick = { this._removeTask }>
                <Remove />
            </span>
        );
    };

    _removeTask = () => {
        console.log(`Click DELETE!!`);
        const { _removeTasktAsync, id } = this.props;

        console.log(`id`, id);

        _removeTasktAsync(id);
    };

    render () {
        const {
            message,
            completed,
            id,
        } = this.props;
        const favorite = this._getFavorite();
        const removeTask = this._getRemoveTask();

        console.log(`Task id - `, id);
        console.log(`Task name - `, message);
        // console.log('taskState.uneditable', this.taskState.uneditable);
        // return <li className = { Styles.task }>Задача: стартовая точка</li>;
        return (<li className = { Styles.task }>
            <input
                // disabled = { this.taskState.uneditable }
                disabled = 'true'
                maxLength = '50'
                type = 'text'
                value = { message }
            />
            <section className = { Styles.actions }>
                {favorite}
                {removeTask}

                {/*<section className = { Styles.updateTaskMessageOnClick } />*/}
                {/*<Edit />*/}

            </section>
        </li>);
    }
}
