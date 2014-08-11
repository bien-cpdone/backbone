<!DOCTYPE html>
<html>
	<head>
		<link rel="stylesheet" href="assets/css/style.css"/>
	</head>
	<body>
		<main>
			<h1>Backbone JS (TODO)</h1><a href="basic.html">Basic</a>
			<div id="todoapp">
				<header>
					<h2>Todos</h2>
					<input id="new-todo" type="text" placeholder="What needs to be done?">
				</header>
				<section id="main">
			      <input id="toggle-all" type="checkbox">
			      <label for="toggle-all">Mark all as complete</label>
			      <ul id="todo-list"></ul>
			    </section>
			    <footer>
			      <a id="clear-completed">Clear completed</a>
			      <div id="todo-count"></div>
			    </footer>
			</div>
		</main>
	</body>
	<script src="assets/js/json2.js"></script>
	<script src="assets/js/jquery.js"></script>
	<script src="assets/js/underscore.js"></script>
	<script src="assets/js/backbone.js"></script>
	<script src="assets/js/backbone.localStorage.js"></script>
	<script src="assets/js/main.js"></script>

	<script type="text/template" id="item-template">
		<div class="view">
			<input class="toggle" type="checkbox" <%= done ? 'checked="checked"' : '' %> />
			<label><%- title %></label>
			<a class="destroy"></a>
		</div>
		<input class="edit" type="text" value="<%- title %>" />
	</script>

	<script type="text/template" id="stats-template">
	<% if (done) { %>
		<a id="clear-completed">Clear <%= done %> completed <%=done == 1 ? 'item' : 'items' %></a>
	<% } %>
	<div class="todo-count"><b><%= remaining %></b> <%= remaining == 1 ? 'item' : 'items' %> left</div>
	</script>
</html>