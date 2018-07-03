// Core
import React, { PureComponent } from 'react';
import { string, func } from "prop-types";

// Instruments
import Styles from './styles.m.css';
import Checkbox from '../../theme/assets/Checkbox';
import Star from '../../theme/assets/Star';
import Remove from '../../theme/assets/Remove';
// import Edit from '../../theme/assets/Edit';

export default class Task extends PureComponent {
    static propTypes = {
        _updateSateAndDBAsync: func.isRequired,
        _completeTaskAsync:    func.isRequired,
        _favoriteTaskAsync:    func.isRequired,
        _removeTasktAsync:     func.isRequired,
    };

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

    _getComplete = () => {
        const {
            completed,
        } = this.props;

        console.log(`completed`, completed);

        return (
            <withSvg
                className = { Styles._toggleTaskCompletedState }
                onClick = { this._completeTask }>
                <Checkbox
                    checked = { completed }
                    color1 = { '#3B8EF3' }
                    color2 = { '#FFF' }
                />

            </withSvg>
        );
    };

    _completeTask = () => {
        // console.log(`Click Complete`);
        // const { _completeTaskAsync, id } = this.props;
        // _completeTaskAsync(id, 'completed', 'Text' );
        const { _updateSateAndDBAsync, id } = this.props;

        _updateSateAndDBAsync(id, 'completed');
    };

    _getFavorite = () => {
        const {
            favorite,
        } = this.props;


        return (
            <div
                className = { Styles.toggleTaskFavoriteState }
                onClick = { this._favoriteTask }>
                <Star
                    checked = { favorite }
                    color1 = { '#3B8EF3' }
                    color2 = { '#000' }
                />

            </div>
        );
    };
    _favoriteTask = () => {
        // console.log(`Click Favorite`);
        // const { _favoriteTaskAsync, id } = this.props;
        // _favoriteTaskAsync(id);
        const { _updateSateAndDBAsync, id } = this.props;

        _updateSateAndDBAsync(id, 'favorite');

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
        // console.log(`Click DELETE!!`);
        const { _removeTasktAsync, id } = this.props;
        // console.log(`id`, id);

        _removeTasktAsync(id);
    };

    render () {
        const {
            message,
            id,
        } = this.props;
        const complete = this._getComplete();
        const favorite = this._getFavorite();
        const removeTask = this._getRemoveTask();

        // console.log(`Task id - `, id);
        // console.log(`Task name - `, message);
        // console.log('taskState.uneditable', this.taskState.uneditable);
        // return <li className = { Styles.task }>Задача: стартовая точка</li>;
        return (<li className = { Styles.task }>
            <div className = { Styles.content }>
                {complete}
                <div className = { Styles.toggleTaskCompletedState } />
                <input
                // disabled = { this.taskState.uneditable }
                    disabled = 'true'
                    maxLength = '50'
                    type = 'text'
                    value = { message }
                />

            </div>
            <div className = { Styles.actions }>
                {favorite}
                {removeTask}
                {/*<section className = { Styles.updateTaskMessageOnClick } />*/}
                {/*<Edit />*/}
            </div>
        </li>);
    }
}
