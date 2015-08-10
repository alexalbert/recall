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

		this.updateDelay = 10000;

		this.changes = new Map();
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
							this.tags = tags.map((tag) => { return {name: tag, checked: false} } );
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
		 });
	}

  newNote() {
		this.notes.unshift({text:"", tags: ""});
//		autosize([$("textarea")[0]]);
	}

	updateNote(note) {
		if (!note.ts_cre) note.ts_cre = new Date();
		note.ts_upd = new Date();
		this.addNewTags(note.tags);
		this.http.createRequest('http://localhost:8000/api/saveNote')
			.asPost()
			.withContent(JSON.stringify(note))
			.withHeader('Content-Type', 'application/json')
			.send();
	}

	onChangeNote(index) {
		console.log("+++++++++++++ " + index);
		this.updateNote(this.notes[index]);
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

	printNote(index) {
		console.log(this.notes[index].text);
	}

	addChange(model, index) {
		setTimeout(() => {
				model.changes.set(model.notes[index]._id, model.notes[index]);
		}, 100);
	}

	addNewTags(tags) {
		tags.forEach(tag => {
			var exists = this.tags.filter(t => {
				return t.name === tag.name;
			});
			if (!exists.length) {
				this.tags.push({name: tag, checked: true});
			}
		})
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
		var tagsSs = tags.replace(",", " ");
		var tagsA = tagsSs.split(' ');
//		model.addNewTags(tagsA);
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
