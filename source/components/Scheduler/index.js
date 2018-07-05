// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST/api';
import Spinner from '../Spinner';
import Task from '../Task';
import Checkbox from '../../theme/assets/Checkbox';


export default class Scheduler extends Component {
    state = {
        completeAll:     false,
        inSetup:         'Ниже Стейты которые были в тестах ;)',
        tasks:           [],
        newTaskMessage:  '', // У меня был message
        tasksFilter:     '', // У меня был filter
        isTasksFetching: false, // У меня был isSpinning
    };

    componentDidMount () {
        this._fetchTasksAsync();
    }

    _fetchTasksAsync = async () => {
        try {
            this._setTasksFetchingState(true);
            const tasks = await api.fetchTasks();

            this.setState({
                tasks,
            });
            this._sortTaskState();

            this._getAllCompleted();

        } catch ({ messageError }) {
            console.error(messageError);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _completeAllTasksAsync = async () => {
        // Фековая функция исключительно для тестов, логика предусматривает другой алгоритм перевода
        // всех задач в статус выполнено ;)
        // В таком виде как есть можно использовать для обовления всех задач на сервере из стейта ;)
        const {
            tasks: updTasks,
        } = this.state;

        try {
            this._setTasksFetchingState(true);
            await api.completeAllTasks(updTasks);

        } catch ({ messageError }) {
            console.error(messageError);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

       _createTaskAsync = async (newTaskMessage) => {
           try {
               this._setTasksFetchingState(true);
               const tasks = await api.createTask(newTaskMessage);

               this.setState((prevState) => ({
                   tasks: [tasks, ...prevState.tasks],
               }));
           } catch ({ errorMessage }) {
               console.error(errorMessage);
           } finally {
               this._sortTaskState();
               this._getAllCompleted();
               this._setTasksFetchingState(false);
           }
       };
    _handleFormSubmit = (e) => {
        e.preventDefault();
        this._submitTask();
    };
    _updateNewTaskMessage = (e) => {
        const { value } = e.target;

        this.setState({ newTaskMessage: value });
    };
     _submitTask = () => {
         const { newTaskMessage } = this.state;

         if (!newTaskMessage) {
             return null;
         }
         this._createTaskAsync(newTaskMessage);
         this.setState({ newTaskMessage: "" });

     };
    _setTasksFetchingState = (isTasksFetching) => {
        this.setState({
            isTasksFetching,
        });
    };

    _submitTaskOnEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            this._submitTask();
        }
    };

    _removeTaskAsync = async (id) => {
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
        }
    };
    _updateTaskAsync = async (updTask) => {
        try {
            this._setTasksFetchingState(true);
            await api.updateTask([updTask]);
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

        this._sortTaskState();

        this._getAllCompleted();

    };

    /**
     * _updateSateAndDBAsync  -  функция для изменения параметров Task и ианесения их в State и DB.
     * @author Adisey.
     * @param {string} id сообщения для изменения
     * @param {string} field Поле для изменения (favorite, completed, message, и др.)
     * @param {string} [textMessage] Значение зля текстового поля.( Для полей с булевыми значениями игнорируется.)
     * @returns {null} Функция ничего не возвращает.
     */
    _updateSateAndDBAsync = (id, field, ...textMessage) => {
        if (!(['edited', 'favorite', 'completed', 'message'].indexOf(field)+1)) {
            console.error(`Принимаются только обновления для полей  "favorite", "completed", "message", "edited" !!!`);

            return;
        } else if (field === 'message' && !textMessage.length) {
            console.error(`При передаче поля вторым параметром "message", обязательно третим параметром передавать текст сообщения !!!`);

            return;
        }
        const { tasks } = this.state;
        const updTask = tasks.filter((task) => task.id === id)[0];

        updTask[field]= field !== 'message'?!updTask[field]:textMessage[0];
        this._updateSateTask(updTask);
        this._updateTaskAsync(updTask);
    };

    _getCompleteAll = () => {
        const {
            completeAll,
        } = this.state;

        return (
            <div>
                <div>
                    <Checkbox
                        checked = { completeAll }
                        color1 = { '#3B8EF3' }
                        color2 = { '#FFF' }
                        onClick = { this._runCompleteAll }
                    />
                </div>
            </div>
        );
    };
    _runCompleteAll = () => {
        ///// !!!!!!!!!!!!!!!!!!!
        const { tasksFilter } = this.state;

        this.state.tasks.
            filter((task) => task.message.toUpperCase().indexOf(tasksFilter.toUpperCase())+1).
            filter((task) => task.completed === false).
            forEach(
                (updTask) => {
                    this._updateSateAndDBAsync(updTask.id, 'completed');
                }
            );

    };

    _getAllCompleted = () => {
        ///// !!!!!!!!!!!!!!!!!!!
        const { tasksFilter } = this.state;

        this.setState({
            completeAll: !this.state.tasks.
                filter((task) => task.message.toUpperCase().indexOf(tasksFilter.toUpperCase()) + 1).
                filter((task) => task.completed === false).length,
        });
        // console.log(`Check compleate! for filter - ${tasksFilter}`);
    };


    _compareTwoTask = (firstTask, secondTask) =>
        firstTask.completed*10+!firstTask.favorite -(secondTask.completed*10+!secondTask.favorite);

    _sortTaskState = () =>
        this.setState(({ tasks }) => ({
            tasks: tasks.sort(
                this._compareTwoTask
            ),
        }));

    _showTasks = () => {
        const { tasks: allTasks, tasksFilter } = this.state;


        return (
            ///// !!!!!!!!!!!!!!!!!!!

            allTasks.
                filter((task) => task.message.toUpperCase().indexOf(tasksFilter.toUpperCase())+1).
                map((task) => (
                    <Task
                        key = { task.id }
                        { ...task }
                        _removeTaskAsync = { this._removeTaskAsync }
                        _updateSateAndDBAsync = { this._updateSateAndDBAsync }
                    />
                ))

        );
    };

    _findFieldOnKeyDown = (e) => {
        if (e.key === "Escape" || e.keyCode === 27|| e.which === 27) {
            this.setState({ tasksFilter: '' });
        }
        // if (e.key === "Enter") {}
        // ToDo пока не понимаю, почему после обновления фильтра в стейт, не отрабатывает проверка на Комплит,
        // по отыильтрованному, Заернул в таймаут, но нужно спросить у Андрея
        setTimeout(() => {
            this._getAllCompleted();
        }, 300);
    };

    _updateTasksFilter = (e) => {
        const { value } = e.target;

        this.setState({ tasksFilter: value });
        // ToDo пока не понимаю, почему после обновления фильтра в стейт, не отрабатывает проверка на Комплит,
        // по отыильтрованному, Заернул в таймаут, но нужно спросить у Андрея
        setTimeout(() => {
            this._getAllCompleted();
        }, 300);
    };


    render () {
        const { isTasksFetching, newTaskMessage, tasksFilter } = this.state;
        const _showTasks = this._showTasks();
        const CompleteAll = this._getCompleteAll();


        return (
            <section className = { Styles.scheduler }>
                <main>
                    <Spinner isTasksFetching = { isTasksFetching } />
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            placeholder = 'Поиск'
                            type = 'searh'
                            value = { tasksFilter }
                            onChange = { this._updateTasksFilter }
                            onKeyDown = { this._findFieldOnKeyDown }
                        />
                    </header>
                    <section>
                        <form onSubmit = { this._handleFormSubmit }>
                            <input
                                maxLength = '50'
                                placeholder = 'Описaние моей новой задачи'
                                type = 'text'
                                value = { newTaskMessage }
                                onChange = { this._updateNewTaskMessage }
                                onKeyPress = { this._submitTaskOnEnter }
                            />
                            <button type = 'submit' >Добавить задачу</button>
                        </form>
                        <div>
                            <ul>{_showTasks}</ul>
                        </div>

                    </section>
                    <footer>
                        {CompleteAll}
                        <span className = { Styles.completeAllTasks }>Все задачи выполнены</span>
                    </footer>

                </main>
            </section>
        );
    }
}
// ToDo 4. Test
// ToDo 5. Красота в кнопке фильтра и анимация везде.
