import * as React from 'react';
import { Text, View, Button, TouchableNativeFeedback, TextInput } from 'react-native';

import { TodoInteractor } from "clean-architecture-todo/dist/interactors/todoInteractor";
import { TodoList } from 'clean-architecture-todo/dist/entities/todoList';
import * as Todo from 'clean-architecture-todo/dist/entities/todo';

class TodoApi {
    getTodos(): Promise<TodoList> {
        throw Error();
    }
    saveTodos(todoList: TodoList): Promise<TodoList> {
        return Promise.resolve(todoList);
    }
}

let todoInteractor = new TodoInteractor(new TodoApi());

type Props = any;
type State = {
  todoList: TodoList;
  todoTitle: string;
}

class App extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = { 
      todoList: [],
      todoTitle: "",
     };
    this.loadTodos();
    this.addTodo = this.addTodo.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
  }

  async loadTodos() {
    let todoList = await todoInteractor.getTodoList();
    this.setState({
      todoList
    });
  }

  async addTodo() {
    let todoList = await todoInteractor.addTodo(this.state.todoList, this.state.todoTitle);
    this.setState({
      todoList,
      todoTitle: ""
    });
  }

  async toggleTodo(todo: Todo.Todo) {
    let todoList = await todoInteractor.toggleTodo(this.state.todoList, todo);
    this.setState({
      todoList
    });
  }

  updateTitle(title: string) {
    this.setState({
      todoTitle: title
    });
  }

  render() {
    let todoList = this.state.todoList ? this.state.todoList.map(todo => 
    <TouchableNativeFeedback
        onPress={() => this.toggleTodo(todo)}>
        <View>
            <Text>{`[${Todo.isDone(todo) ? "x" : ""}] ${Todo.title(todo)} - ${Todo.age(todo)}`}</Text>
        </View>
    </TouchableNativeFeedback>): <></>;

    return (
      <View style={{padding: 10}}>
        <TextInput 
            style={{height: 50, borderColor: 'gray', borderWidth: 1}}
            value={this.state.todoTitle} 
            onChangeText={this.updateTitle}
            />
        <Button 
            onPress={this.addTodo}
            title="Add TODO"
        />
        {todoList}        
      </View>
    );
  }
}

export default App;