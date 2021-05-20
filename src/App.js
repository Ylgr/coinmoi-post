import {Container, Button, Input, Card, CardText, CardTitle} from 'reactstrap';
import React from 'react';
import axios from "axios";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            link: null,
            password: null,
            isStart: false
        }

    }

    ajax () {
        return axios.create({
            baseURL: `https://api.telegram.org/bot${process.env.REACT_APP_BOT_TOKEN}/`,
            responseType: 'json',
            withCredentials: false,
            transformResponse: [function (data) {
                return data;
            }]
        })
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    componentDidMount() {
        this.ajax().get('getUpdates').then((msg) => {
            this.setState({posts: msg.data.result.filter(e => e.message && e.message.chat.id.toString() === process.env.REACT_APP_POST_GROUP_ID)})
        })

    }

    send(index) {
        if(this.state.link) {
            const post = this.state.posts[index].message
            const option = {
                chat_id: process.env.REACT_APP_POST_CHANNEL_ID,
                photo: post.photo[0].file_id,
                caption: post.caption,
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: '🔗Xem chi tiết',
                            url: this.state.link
                        }]
                    ]
                }
            }
            this.ajax().post('sendPhoto', option)
        } else alert('you need to fill url')

    }

    render() {
        return (
            <Container className="App">
                {this.state.password === process.env.REACT_APP_PASSWORD ? <div>
                    <h1>Coinmoi post</h1>
                    <Input name="link" type="string" value={this.state.link} onChange={(e) => this.handleChange(e)} placeholder="input link here"/>
                    {this.state.posts.map((e,index) => <Card>
                        <CardText>{index+1}. {e.message.caption ? e.message.caption : e.message.text}</CardText>
                        {e.message.caption ? <Button onClick={() => this.send(index)}>Send</Button>: ''}
                    </Card>)}

                    </div>: <div>
                    <Input name="password" type="string" value={this.state.password} onChange={(e) => this.handleChange(e)} placeholder="password"/>
                </div>
                }

            </Container>
        );
    }

}

export default App;
