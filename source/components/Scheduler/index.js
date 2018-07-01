// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';
import Spinner from '../Spinner';
import Task from '../Task';

export default class Scheduler extends Component {
    state = {
        tasks:      [],
        isSpinning: false,
    };

    componentDidMount () {
        console.log('componentDidMount App');

        // Временно прикручен спинер, потом убрать и включить для асинхроннвх операций обращения к серверу.
        this.setState({ isSpinning: true });
        setTimeout(() => {
            this.setState({ isSpinning: false });
        }, 6000);

    }


    render () {
        const { isSpinning } = this.state;

        console.log('isSpinning - ', isSpinning);


        return (
            <section className = { Styles.scheduler }>
                <main>
                    <Spinner isSpinning = { isSpinning } />
                    <header>
                        <h1>Планировщик задач</h1>
                        <input placeholder = 'Поиск' type = 'searh' value = '' />
                    </header>
                    <section>
                        <form>
                            <input maxLength = '50' placeholder = 'Описaние моей новой задачи' type = 'text' value = '' />
                            <button>Добавить задачу</button>
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
