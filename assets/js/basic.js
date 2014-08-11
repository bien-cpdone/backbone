$(function(){

	var Node = Backbone.Model.extend({

		defaults: function() {
			return {
				title		: "New Title",
				description : "New Description",
				id 			: 0
			}
		}
	});


	var NodeList = Backbone.Collection.extend({

		model: Node,

		localStorage: new Backbone.LocalStorage("node-backbone"),

		comparator: 'id'
	});

	var Nodes = new NodeList;

	var NodeView = Backbone.View.extend({

		tagName: 'li',

		template: _.template($('#node-template').html()),

		events: {
			'click .btn-node-edit'		: 'editNode',
			'click .btn-node-delete'	: 'deleteNode',
			'focus .node-title'			: 'focusNode',
			'focusout .node-title'		: 'blurNode'
		},

		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove)
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		// editNode: function() {
		// 	console.log('Invoked edit Node');
		// 	this.$('.node-title').focus();
		// 	this.$('.node-title').select();
		// },

		// focusNode: function() {
		// 	console.log('Invoked focus Node');
		// 	this.$('.node-title').addClass('edit-node');
		// },

		// blurNode: function() {
		// 	console.log('Invoked blur Node');
		// 	this.$('.node-title').removeClass('edit-node');
		// },

		deleteNode: function() {
			this.model.destroy();
		}

	});


	var AppView = Backbone.View.extend({

		el: $('#nodeapp'),

		events: {
			'keypress #new-node': "createOnEnter",
			'click #new-submit' : "createOnSubmit"
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

			console.log("Invoked createOnSubmit()");
			Nodes.create(
				{
					title 		 : this.title.val(), 
					description  : this.description.val()
				});
			this.title.val('');
			this.description.val('');
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
		}
	});
	var App = new AppView;
});


