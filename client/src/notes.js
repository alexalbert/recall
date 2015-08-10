import {AuthService} from 'paulvanbladel/aurelia-auth';
import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
//import 'jackmoore/autosize@3.0.8/dist/autosize'

@inject(AuthService, HttpClient)
export class Notes {
	constructor(auth, http) {
		// http.configure(config => {
		//   config
		//     .useStandardConfiguration()
		//     .withBaseUrl('http://localhost:8000/auth/me');
		// });

		this.auth = auth;
		this.http = http;
		this.notes = [];
		this.tags = [];
		this.keywords = "";

		this.updateDelay = 10000;

		this.changes = new Map();
//		this.notesMap = new Map();
	};

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

	activate() {
		console.log(localStorage.aurelia_token);
		this.scheduleSaveUpdates();

		this.http.createRequest('http://localhost:8000/auth/me')
			.asGet()
			.withHeader('Authorization', 'Bearer ' + localStorage.aurelia_token).send()
			.then(data => {
				this.profile = JSON.parse(data.response);
				this.userId = this.profile._id;
			})
			.then(() => {
				 var promise1 = this.getNotes();

					var promise2 = this.http.createRequest('http://localhost:8000/api/getTags?user=' + this
							.userId).asGet().send()
						.then((data) => {
							var tags = JSON.parse(data.response);
							if (tags.length) {
								tags = [];
							} else {
								this.tags = tags.map((tag) => { return {name: tag, checked: false} } );
							}
						});

						return Promise.all([promise1, promise2]);
			});
	}

	deactivate() {
		clearInterval(this.interval);
		this.saveUpdates();
	}

	getNotes(tag) {
		var params = 'user=' + this.userId;
		if (tag) {
			params += ('&tag=' + tag);
		}
		return this.http.createRequest('http://localhost:8000/api/getNotes?' + params).asGet().send()
		 .then((data) => {
			 this.notes = JSON.parse(data.response);
//			 this.createNoteMap(this.notes);
		 });
	}

  newNote() {
		var note = {text:"", tags: "", id: this.uuid()};
		this.notes.unshift(note);
//		this.notesMap.set(note.id, note);
//		autosize([$("textarea")[0]]);
	}

	updateNote(note) {
		if (!note.ts_cre) note.ts_cre = new Date();
		note.ts_upd = new Date();
		note.userId = this.userId;
		this.addNewTags(note.tags);
		this.http.createRequest('http://localhost:8000/api/saveNote')
			.asPost()
			.withContent(JSON.stringify(note))
			.withHeader('Content-Type', 'application/json')
			.send().then(res => {
				note._id = res.response.replace(/\"/g, "");
			});
	}

	onChangeNote(index) {
		console.log("+++++++++++++ " + id);
		this.updateNote(this.notes[index]);
	}

	search() {
		if (!this.keywords || !this.keywords.length) return;

		var params = 'user=' + this.userId;
		if (this.selectedTag) {
			params += ('&tag=' + this.selectedTag);
		}
		params += ('&keywords=' + this.keywords);

		return this.http.createRequest('http://localhost:8000/api/searchNotes?' + params).asGet().send()
		 .then((data) => {
			 this.notes = JSON.parse(data.response);
	//		 this.createNoteMap(this.notes);
		 });
	 }

	// createNoteMap(notes) {
	// 	notes.forEach(note => {
	// 		 note.id = this.uuid();
	// 		 this.notesMap.set(note.id, note.id);
	// 	 });
	// }

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
		// setTimeout(() => {
		// 		model.changes.set(model.notesMap.get(id), model.notesMap.get(id));
		// }, 100);
	}

	addNewTags(tags) {
		if (tags === "") return;
		tags.forEach(tag => {
			var exists = this.tags.filter(t => {
				return t.name === tag.name;
			});
			if (!exists.length) {
				this.tags.push({name: tag, checked: true});
			}
		})
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
		// model.notes[index].text = text;
		// model.onChangeNote(index);
		// console.log('filter' + text);
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
		if (!tags || tags.lengt === 0) return "";
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
