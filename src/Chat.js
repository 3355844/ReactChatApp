import React from "react";
import io from "socket.io-client";

const re = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/i;

class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            message: '',
            messages: []
        };

        this.socket = io('localhost:8080');

        this.socket.on('RECEIVE_MESSAGE', function (data) {
            addMessage(data);
        });

        const addMessage = data => {
            console.log(data);
            this.setState({messages: [...this.state.messages, data]});
            console.log(this.state.messages);
        };

        this.sendMessage = ev => {
            ev.preventDefault();


            console.log(re.test(this.state.username));
            if (re.test(this.state.username) && this.state.message.length <= 200) {
            console.log('Is correct');
                this.socket.emit('SEND_MESSAGE', {
                    author: this.state.username,
                    message: this.state.message
                });

                this.setState({username: ''});

            }else {
                alert('Your userName is not correct or your message length is more them 200 symbols...!!!');
                this.setState({username: ''});
                this.setState({message: ''});
            }

        }
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="card-title">Global Chat</div>
                                <hr/>
                                <div className="messages">
                                    {this.state.messages.map(message => {
                                        return (
                                            <div>{message.author} : {message.message}</div>
                                        )
                                    })}
                                </div>

                            </div>
                            <div className="card-footer">
                                <input type="text" placeholder="Username" value={this.state.username}
                                       onChange={ev => this.setState({username: ev.target.value})}
                                       className="form-control"/>
                                <br/>
                                <input type="text" placeholder="Message" className="form-control"
                                       value={this.state.message}
                                       onChange={ev => this.setState({message: ev.target.value})}/>
                                <br/>
                                <button onClick={this.sendMessage} className="btn btn-primary form-control">Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;