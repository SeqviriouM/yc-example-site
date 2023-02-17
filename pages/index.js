// import React from 'react';
import React, {useCallback, useState} from 'react';

import axios from 'axios';
import classnames from 'classnames';
import Head from 'next/head';

import Button from '../components/Button';
import Card from '../components/Card';
import TextInput from '../components/TextInput';

const renderFormRow = (title, error, renderControl) => {
    return (
        <div className="form-row">
            <div className="form-row-title">
                <span className="form-row-title-text">{title}</span>
            </div>
            <div
                className={classnames('form-row-control', {
                    'form-row-control_error': Boolean(error),
                })}
            >
                {renderControl()}
            </div>
            {error && <div className="form-row-error">{error}</div>}
        </div>
    );
};

const renderFormResponse = (formResponse) => {
    if (!formResponse) {
        return null;
    }

    return (
        <Card
            type="container"
            view="filled"
            theme={formResponse.status === 'success' ? 'positive' : 'danger'}
            className="form-response"
        >
            {formResponse.message}
        </Card>
    );
};

const IndexPage = () => {
    const [name, setName] = useState('');
    const [score, setScore] = useState('');
    const [loading, setLoading] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [scoreError, setScoreError] = useState(false);
    const [formResponse, setFormResponse] = useState(false);

    const updateName = useCallback(async (value) => {
        setNameError(null);
        setName(value);
    }, []);

    const updateScore = useCallback(async (value) => {
        setScoreError(null);
        setScore(value);
    }, []);

    const confirm = useCallback(async () => {
        let isValid = true;

        setFormResponse(null);

        if (!name) {
            isValid = false;
            setNameError('Поле не заполнено');
        }

        if (!score) {
            isValid = false;
            setScoreError('Поле не заполнено');
        }

        if (!isValid) {
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('/api/handler', {
                name,
                score,
            });

            if (response?.data) {
                setFormResponse(response.data);
            }
        } catch (error) {
            console.error('error', error);

            if (error?.response?.data) {
                setFormResponse(error.response.data);
            }
        } finally {
            setLoading(false);
        }
    }, [name, score]);

    return (
        <div className="yc-root yc-root_theme_light container">
            <Head>
                <title>Yandex Cloud Site</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="main">
                <h1 className="title">Добавить результат</h1>

                <div className="form">
                    {renderFormRow(
                        'Ваше имя',
                        nameError,
                        () => (
                            <TextInput
                                view="clear"
                                name="name"
                                value={name}
                                onUpdate={updateName}
                            />
                        ),
                        true,
                    )}
                    {renderFormRow(
                        'Ваш результат',
                        scoreError,
                        () => (
                            <TextInput
                                view="clear"
                                name="score"
                                value={score}
                                onUpdate={updateScore}
                            />
                        ),
                        true,
                    )}
                    <div className="form-row submit">
                        <Button
                            view="action"
                            className="form-submit"
                            size="xl"
                            loading={loading}
                            onClick={confirm}
                        >
                            Отправить
                        </Button>
                    </div>
                    {renderFormResponse(formResponse)}
                </div>
            </main>
        </div>
    );
};

export default IndexPage;
