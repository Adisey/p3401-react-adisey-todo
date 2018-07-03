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
        this._fetchTasksAsync();

    }

    _fetchTasksAsync = async () => {
        // Получение тасков с сервера
        try {
            this._setTasksFetchingState(true);
            const tasks = await api.fetchTasks();
            // console.log('tasks -', tasks);

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
        // console.log(`_createTasksAsync`);
        // console.log(`_createTasksAsync message`, message);
        try {
            this._setTasksFetchingState(true);
            const tasks = await api.createTasks(message);

            this.setState((prevState) => ({
                tasks: [tasks, ...prevState.tasks],
            }));
        } catch ({ errorMessage }) {
            console.error(errorMessage);
        } finally {
            this._setTasksFetchingState(false);
        }
    };
    _handleFormSubmit = (e) => {
        e.preventDefault();
        // console.log(`handleFormSubmit`);
        this._submitTask();
    };
    _updateTask = (e) => {
        const { value } = e.target;
        // console.log('message value - ', value);

        this.setState({ message: value });
    };
    _submitTask = () => {
        // console.log(`_submitTask`);
        // console.log('_submitCommen - State ', this.state);
        const { message } = this.state;
        // console.log('Submit message - ', message);

        if (!message) {
            return null;
        }

        // TODO Кажется эта строка тут не нужна!
        // const { _createTasksAsync } = this.props;

        this._createTasksAsync(message);
        this.setState({ message: "" });
    };
    _setTasksFetchingState = (isSpinning) => {
        this.setState({
            isSpinning,
        });
    };

    _submitTaskOnEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            // console.log("Enter");
            this._submitTask();
        }
    };

    _removeTasktAsync = async (id) => {
        // console.log(`Start - _removeTasktAsync`);
        try {
            this._setTasksFetchingState(true);
            await api.removeTask(id);
            this.setState(({ tasks }) => ({
                tasks: tasks.filter((task) => task.id !== id),
            }));
        } catch ({ errorMessage }) {
            console.error(errorMessage);
        } finally {
            this._setTasksFetchingState(false);
            // console.log(`End - _removeTasktAsync`);
        }
    };
    _updateDBTaskAsync = async (updTask) => {
        try {
            this._setTasksFetchingState(true);
            await api.putTasks([updTask]);
        } catch (response) {
            console.error(response);
        } finally {
            this._setTasksFetchingState(false);
        }
    };
    _updateSateTask = (updTask) => {
        const id = updTask.id;

        this.setState(({ tasks }) => ({
            tasks: tasks.map((task) => task.id === id ? updTask : task),
        }));
    };

    /**
     * _updateSateAndDBAsync  -  функция для изменения параметров Task и ианесения их в State и DB.
     * @author Adisey.
     * @param {string} id сообщения для изменения
     * @param {string} field Поле для изменения (favorite, completed, message, и др.)
     * @param {string} [textMessege] Значение зля текстового поля.( Для полей с булевыми значениями игнорируется.)
     */
    _updateSateAndDBAsync = (id, field, ...textMessege) => {
        if (!(['favorite', 'completed', 'message'].indexOf(field)+1)) {
            console.error(`Принимаются только обновления для полей  "favorite", "completed", "message" !!!`);

            return;
        } else if (field === 'message' && !textMessege.length) {
            console.error(`При передаче поля вторым параметром "message", обязательно третим параметром передавать текст сообщения !!!`);

            return;
        }
        const { tasks } = this.state;
        const updTask = tasks.filter((task) => task.id === id)[0];

        updTask[field]= field !== 'message'?!updTask[field]:textMessege[0];
        this._updateSateTask(updTask);
        this._updateDBTaskAsync(updTask);
    };

    render () {
        // console.log('Render State -', this.state);
        const { tasks: userTasks, isSpinning, message } = this.state;

        // console.log('Render isSpinning - ', isSpinning);
        // console.log('Render message - ', message);
        const showTasks = userTasks.map((task) => (
            <Task
                key = { task.id }
                { ...task }
                _removeTasktAsync = { this._removeTasktAsync }
                _updateSateAndDBAsync = { this._updateSateAndDBAsync }
            />
        ));

            // console.log(`showTasks - `, showTasks);
            // console.log('this.state', this.state);
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
                                value = { message }
                                onChange = { this._updateTask }
                                onKeyPress = { this._submitTaskOnEnter }
                            />
                            <button type = 'submit' >Добавить задачу</button>
                        </form>
                        <div>
                            {/*<Task />*/}
                            <ul><n>{showTasks}</n></ul>
                        </div>

                    </section>

                </main>
            </section>
        );
    }
}
// ToDo 1. Edit
// ToDo 2. Filter
// ToDo 3. Sort
// ToDo 4. Test
