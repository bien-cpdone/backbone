$(function(){

	var Node = Backbone.Model.extend({

		defaults: function() {
			return {
				title		: "New Title",
				description : "New Description",
				id 			: Nodes.nextId()
			}
		}
	});


	var NodeList = Backbone.Collection.extend({

		model: Node,

		localStorage: new Backbone.LocalStorage("node-backbone"),

		nextId: function() {
			if (!this.length) return 1;
			return this.last().get('id') + 1;
		},

		comparator: 'id'
	});

	var Nodes = new NodeList;

	var NodeView = Backbone.View.extend({

		tagName: 'li',

		template: _.template($('#node-template').html()),

		events: {
			'click .btn-node-save'		: 'saveNode',
			'click .btn-node-delete'	: 'deleteNode',
		},

		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove)
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		saveNode: function() {
			var inputTitle = this.$('.node-title').val();
			var inputDescription = this.$('.node-description').val();
			console.log(inputTitle + " " + inputDescription)
			this.model.save({title: inputTitle, description: inputDescription});
		},

		deleteNode: function() {
			this.model.destroy();
		}

	});


	var AppView = Backbone.View.extend({

		el: $('#nodeapp'),

		events: {
			'click #new-submit' : "createOnSubmit",
			'keypress #new-description': "createOnEnter"
		},

		initialize: function() {

			this.title 		 = this.$('#new-node');
			this.description = this.$('#new-description') ;
			this.main  		 = this.$('#main');
			this.listenTo(Nodes, 'add', this.addOne);
			this.listenTo(Nodes, 'all', this.render);

			Nodes.fetch();
		},

		render: function() {

			if (Nodes.length) {
				this.main.show();
			} else {
				this.main.hide();
			}
		},

		addOne: function(node) {
			var view = new NodeView({model: node});
			this.$('#node-list').append(view.render().el);
		},

		createOnEnter: function(e) {
			if (e.keyCode != 13) return;
			if (!this.title.val()) return;

			this.createOnSubmit();
		},

		createOnSubmit: function() {

			console.log("Invoked createOnSubmit()");
			Nodes.create(
				{
					title 		 : this.title.val(), 
					description  : this.description.val()
				});
			this.title.val('');
			this.description.val('');
			this.title.focus();
		}
	});
	var App = new AppView;
});