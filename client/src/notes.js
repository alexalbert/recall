import {AuthService} from 'paulvanbladel/aurelia-auth';
import {inject} from 'aurelia-framework';
import {ServerApi} from './server-api';
import autosizeTextarea from 'jackmoore/autosize@3.0.8/dist/autosize'

@inject(AuthService, ServerApi)
export class Notes {
	constructor(auth, server) {
		this.auth = auth;
		this.server = server;

		this.updateDelay = 10000;
		this.notes = [];
		this.tags = [];
		this.keywords = "";
		this.changes = new Map();
	};

	activate() {
		console.log(localStorage.aurelia_token);
		this.scheduleSaveUpdates();

		this.auth.getMe()
			.then(data => {
				this.profile = data;
				this.userId = this.profile._id;
			})
   		.then(() => {
				 var promise1 = this.getNotes();

					var promise2 = this.server.getTags(this.userId)
						.then((data) => {
							this.tags = JSON.parse(data.response);
						});

						return Promise.all([promise1, promise2]);
			});
	}

	deactivate() {
		clearInterval(this.interval);
		this.saveUpdates();
	}

	saveUpdates() {
		this.changes.forEach(value => this.updateNote(value));
		this.changes.clear();
	};

	scheduleSaveUpdates() {
		this.interval = setInterval(() => {
				this.saveUpdates();
			},
			this.updateDelay);
	}

	getNotes(tag) {
		this.saveUpdates();
		return this.server.getNotes(this.userId, tag)
		 .then((data) => {
			 this.notes = JSON.parse(data.response);
			 this.autosizeNotes();
		 });
	}

  newNote() {
		var note = {text:"", tags: this.selectedTag ? [this.selectedTag] : [], id: this.uuid()};
		this.notes.unshift(note);
		this.autosizeNotes();
	}

	updateNote(note) {
		if (!note.ts_cre) note.ts_cre = new Date();
		note.ts_upd = new Date();
		note.userId = this.userId;
		if (note.tags === "") delete note.tags;

		this.addNewTags(note.tags);
		this.server.updateNote(note)
			.then(res => {
				note._id = res.response.replace(/\"/g, "");
			});
	}

	search() {
		if (!this.keywords || !this.keywords.length) return;

		this.saveUpdates();

		var params = '?user=' + this.userId;
		if (this.selectedTag) {
			params += ('&tag=' + this.selectedTag);
		}
		params += ('&keywords=' + this.keywords);

		return this.server.search(this.userId, this.tag, this.keywords)
		 .then((data) => {
			 this.notes = JSON.parse(data.response);
			 this.autosizeNotes();
		 });
	 }

	tagClicked(tagName) {
		if (this.selectedTag === tagName) {
			this.selectedTag = undefined;
			this.getNotes();
		} else {
			this.selectedTag = tagName;
			this.getNotes(tagName);
		}
	}

	addChange(model, index) {
		model.changes.set(model.notes[index].id, model.notes[index]);
		console.log(model.changes.size);
	}

	addNewTags(tags) {
		if (!tags) return;
		tags.forEach(tag => {
			var exists = this.tags.filter(t => {
				return t === tag;
			});
			if (!exists.length) {
				this.tags.push(tag);
			}
		})
	}

	autosizeNotes() {
		setTimeout(() => {
			autosizeTextarea($("textarea"));
		}, 10);
	}

	uuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
		});
	}
}

export class UpdateDbValueConverter {
	fromView(text, model, index) {
		model.addChange(model, index);
		return text;
	}
}

export class DateFormatValueConverter {
		toView(date) {
			return new Date(date).toLocaleString();
	}
}

export class TagValueConverter {
	toView(tags) {
		if (!tags || tags.length === 0) return "";
		return tags.join(' ');
	}
	fromView(tags, model, index) {
		model.addChange(model, index);
		if (tags === "") return [];
		var tagsSs = tags.replace(",", " ");
		var tagsA = tagsSs.split(' ');
		return tagsA;
	}
}

export class FilterByTagsValueConverter {
		toView(notes, tags) {
			var selectedTags = tags.filter(tag => { if (tag.checked) return tag.name; });
			return notes.filter(note => {
				note.tags.forEach(tag => {
					if (selectedTags.includes(tag)) return note;
				})
			});
		}
}
