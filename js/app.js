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
	cmp._todoList
		.on('change', '.toggle', cmp.toggle.bind(this))
		.on('click', '.delete', cmp.delete.bind(this))
		.on('dblclick', '.todo-item', cmp.edit.bind(this))
		.on('click', '.edit', cmp.edit.bind(this))
		.on('keyup', '.editing', cmp.editKeyup.bind(this))
		.on('focusout', '.editing', cmp.update.bind(this));
};
Todo.prototype.create = function(e) {
	var cmp = this,
		input = $(e.target),
		val = input.val().trim();

	if (e.which !== cmp.ENTER_KEY || !val) {
		return;
	}

	cmp.todos.unshift({
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
Todo.prototype.getIndexFromEl = function(el) {
	var cmp = this,
		id = $(el).closest('li').data('id'),
		todos = cmp.todos,
		i = todos.length;

	while (i--) {
		if (todos[i].id === id) {
			return i;
		}
	}
};
Todo.prototype.delete = function(e){
	var cmp = this;

	cmp.todos.splice(cmp.getIndexFromEl(e.target), 1);
	cmp.render();
};
Todo.prototype.edit = function(e){
	var cmp = this,
		input = $(e.target).closest('li').find('input.todo-item');

	input.removeAttr('disabled').addClass('editing').focus();
};
Todo.prototype.editKeyup = function(e){
	var cmp = this;

	if (e.which === cmp.ENTER_KEY) {
		e.target.blur();
	}
};
Todo.prototype.update = function(e){
	var cmp = this,
		el = e.target,
		$el = $(el),
		val = $el.val().trim();

	if (!val) {
		cmp.delete(e);
		return;
	}

	cmp.todos[cmp.getIndexFromEl(el)].title = val;

	cmp.render();
};
Todo.prototype.toggle = function(e){
	var cmp = this,
		i = cmp.getIndexFromEl(e.target);

	cmp.todos[i].completed = !cmp.todos[i].completed;
	cmp.render();

};