// Core
import React, { PureComponent } from 'react';
import { func } from "prop-types";

// Instruments
import Styles from './styles.m.css';
import Checkbox from '../../theme/assets/Checkbox';
import Star from '../../theme/assets/Star';
import Remove from '../../theme/assets/Remove';
import Edit from '../../theme/assets/Edit';

export default class Task extends PureComponent {
    static propTypes = {
        _removeTasktAsync:     func.isRequired,
        _updateSateAndDBAsync: func.isRequired,
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

        // console.log(`completed`, completed);

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
        const { _updateSateAndDBAsync, id } = this.props;

        _updateSateAndDBAsync(id, 'completed');
        //
        // Заготовка для отправки сообщений.
        // _updateSateAndDBAsync(id, 'message', 'Спать');
    };

    _getFavorite = () => {
        const {
            favorite,
        } = this.props;


        return (
            <withSvg
                className = { Styles.toggleTaskFavoriteState }
                onClick = { this._favoriteTask }>
                <Star
                    checked = { favorite }
                    color1 = { '#3B8EF3' }
                    color2 = { '#000' }
                />

            </withSvg>
        );
    };
    _favoriteTask = () => {
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


    _getEditTask = () => {
        const { edited } = this.props;


        return (
            <withSvg
                className = { Styles.updateTaskMessageOnClick }
                onClick = { this._editTask } >
                <Edit
                    checked = { edited }
                    color1 = { '#3B8EF3' }
                    color2 = { '#000' }
                />
            </withSvg>
        );
    };

    _editTask = () => {
        const {
            id,
            edited,
            message,
            _updateSateAndDBAsync } = this.props;
        // console.log(`Click EditTask ${id} - ${edited}`);
        // console.log("Input Value: ", this.input.value);

        if (edited) {
            console.log("OLD Input Value: ", message);
            console.log("NEW Input Value: ", this.input.value);

            _updateSateAndDBAsync(id, 'message', this.input.value);
        }
        _updateSateAndDBAsync(id, 'edited');

    };

    _getInputTask = () => {
        const {
            edited,
            message,
        } = this.props;

        return (
            <div className = { Styles.toggleTaskCompletedState }>
                <input
                    defaultValue = { message }
                    disabled = { !edited }
                    maxLength = '50'
                    ref = { (input) => this.input = input }
                    type = 'text'
                    onKeyDown = { this._inputKeyDown }
                    onKeyPress = { this._inputKeyPress }

                />
            </div>
        );
    };

    _inputKeyDown = (e) => {
        if (e.key === "Escape" || e.keyCode === 27|| e.which === 27) {
            const { message } = this.props;

            this.input.value = message;
            this._editTask();
        }
    };
    _inputKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            this._editTask();
        }
    };

    render () {
        const {
            id,
            message,
            edited,
        } = this.props;
        const Complete = this._getComplete();
        const Input = this._getInputTask();
        const Favorite = this._getFavorite();
        const EditB = this._getEditTask();
        const RemoveTask = this._getRemoveTask();

        console.log(`Task id   - `, id);
        console.log(`Task message - `, message);
        console.log(`Task edited - `, edited);
        console.log(`Task edited - `, edited? 1:0);

        return (<li className = { Styles.task }>
            <div className = { Styles.content }>
                {Complete}
                {Input}
            </div>
            <div className = { Styles.actions }>
                {Favorite}
                {EditB}
                {RemoveTask}
            </div>
        </li>);
    }
}
