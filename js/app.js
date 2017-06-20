$(document).ready(function () {
   $('.j-todo').each(function () {
      new Todo(this);
   });
});

var storage = {
	id: function () {
		var i, random;
		var id = '';

		for (i = 0; i < 32; i++) {
			random = Math.random() * 16 | 0;
			if (i === 8 || i === 12 || i === 16 || i === 20) {
				id += '-';
			}
			id += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
		}

		return id;
	},
	store: function (namespace, data) {
		if (arguments.length > 1) {
			return localStorage.setItem(namespace, JSON.stringify(data));
		} else {
			var store = localStorage.getItem(namespace);
			return (store && JSON.parse(store)) || [];
		}
	}
};

function Todo (container) {
	this.container = $(this);
	this.ENTER_KEY = 13;
	this.todos = storage.store('todos');
	this._newTodo = $('#new-todo');
	this._todoList = $('#todo-list');
	this.todoTemplate = Handlebars.compile($('#todo-template').html());
	this.init();
}
Todo.prototype.init = function(){
	var cmp = this;

	cmp.render();
	cmp.bindEvents();
};
Todo.prototype.bindEvents = function(){
	var cmp = this;

	cmp._newTodo.on('keyup', cmp.create.bind(this));
};
Todo.prototype.create = function(e) {
	var cmp = this,
		input = $(e.target),
		val = input.val().trim();

	if (e.which !== cmp.ENTER_KEY || !val) {
		return;
	}

	cmp.todos.push({
		id: storage.id(),
		title: val,
		completed: false
	});

	input.val('');

	cmp.render();
};
Todo.prototype.render = function(){
	var cmp = this,
		todos = cmp.todos;

	cmp._todoList.html(cmp.todoTemplate(todos));
	cmp._newTodo.focus();
	storage.store('todos', cmp.todos);
};