// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';
import Task from '../Task';

export default class Scheduler extends Component {
    render () {
        return (
            <section className = { Styles.scheduler }>
                <main>
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
