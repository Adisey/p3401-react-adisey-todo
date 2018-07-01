// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST/api';
import Spinner from '../Spinner';
import Task from '../Task';

export default class Scheduler extends Component {
    state = {
        tasks:      [],
        message:    '',
        isSpinning: false,
    };

    componentDidMount () {
        console.log('componentDidMount App');

        // Временно прикручен спинер, потом убрать и включить для асинхроннвх операций обращения к серверу.
        // this.setState({ isSpinning: true });
        // setTimeout(() => {
        //     this.setState({ isSpinning: false });
        // }, 6000);

        this._fetchTasksAsync();

    }

    _fetchTasksAsync = async () => {
        // Получение тасков с сервера
        try {
            this._setTasksFetchingState(true);
            const tasks = await api.fetchTasks();

            console.log('tasks -', tasks);
            this.setState({
                tasks,
            });

        } catch ({ message }) {
            console.error(message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _createTasksAsync = async (message) => {
        console.log(`_createTasksAsync`);
        try {
            this._setTasksFetchingState(true);
            const tasks = await api.createPost(message);

            this.setState((prevState) => ({
                posts: [tasks, ...prevState.tasks],
            }));
        } catch ({ errorMessage }) {
            console.error(errorMessage);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _handleFormSubmit = (e) => {
        e.preventDefault();
        console.log(`handleFormSubmit`);
        this._submitTask();
    };
    _submitTask = () => {
        console.log(`_submitTask`);
        console.log('_submitCommen - State ', this.state);

        const { message } = this.state;

        console.log('message - ', message);
        if (!message) {
            return null;
        }
        const { _createTasksAsync } = this.props;

        _createTasksAsync(message);
        this.setState({ message: "" });
    };
    _setTasksFetchingState = (isSpinning) => {
        this.setState({
            isSpinning,
        });
    };
    render () {
        console.log('Render State -', this.state);
        const { isSpinning, message } = this.state;
        console.log('Render isSpinning - ', isSpinning);
        console.log('Render message - ', message);

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <Spinner isSpinning = { isSpinning } />
                    <header>
                        <h1>Планировщик задач</h1>
                        <input placeholder = 'Поиск' type = 'searh' value = '' />
                    </header>
                    <section>
                        <form onSubmit = { this._handleFormSubmit }>
                            <input
                                maxLength = '50'
                                placeholder = 'Описaние моей новой задачи'
                                type = 'text'
                                // value = { message }
                            />
                            <button type = 'submit' >Добавить задачу</button>
                        </form>
                        <div>
                            <Task />
                        </div>

                    </section>

                </main>
            </section>
        );
    }
}
