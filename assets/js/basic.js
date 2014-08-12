$(function(){

	var Node = Backbone.NestedModel.extend({

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
			'click .btn-node-save'		 : 'saveNode',
			'click .btn-node-add'		 : 'addNode',
			'click .btn-node-delete'	 : 'deleteNode',
			'keypress .node-title'		 : 'saveNodeOnEnter',
			'keypress .node-description' : 'saveNodeOnEnter'
		},

		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove)
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		addNode: function() {
			$('#add-button').hideElement();
			$('#new-node').focus();
		},

		saveNode: function() {
			var inputTitle = this.$('.node-title').val();
			var inputDescription = this.$('.node-description').val();
			console.log(inputTitle + " " + inputDescription)
			this.model.save({title: inputTitle, description: inputDescription});
			$('.alert.saved').showLimitedTime(2500);
		},

		saveNodeOnEnter: function(e) {
			if (e.keyCode != 13) return;
			this.saveNode();
		},

		deleteNode: function() {
			this.model.destroy();
		}

	});


	var AppView = Backbone.View.extend({

		el: $('#nodeapp'),

		events: {
			'click #new-submit' 		: "createOnSubmit",
			'keypress #new-description'	: "createOnEnter",
			'click #add-button'			: "showAddDialog"
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

		showAddDialog: function(e) {
			$(e.target).hide();
			this.$('.add-dialog').showElement();
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
			$('#add-button').showElement();
			$('.add-dialog').hideElement();
			$('#add-modal').modal('hide');
			$('.alert.added').showLimitedTime(3500);
		}
	});
	var App = new AppView;

	$.fn.showLimitedTime = function(duration) {
		return this.each(function(){
			$this = $(this);
			$this.removeAttr('style').removeClass('hide').fadeOut(duration);
			setTimeout(function(){
				$this.removeAttr('style').addClass('hide');
			}, duration)
		});
	};

	$.fn.showElement = function() {
		return this.each(function(){
			$(this).removeAttr('style').removeClass('hide');
		});
	};

	$.fn.hideElement = function() {
		return this.each(function(){
			$(this).removeAttr('style').addClass('hide');
		});
	};
});