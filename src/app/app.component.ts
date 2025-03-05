import { Component } from '@angular/core';
import { AppService } from './app.service';
import { Tarea } from './tarea';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	tareas: Tarea[];
	popupOpen = false;
	selectedTasks = new Set<number>(); 

	constructor(
        public service: AppService,
	) { }
	
	ngOnInit() {
		this.obtenerTareas();
	}

	async obtenerTareas() {
		this.tareas = await this.service.obtenerTareas();
	}

	openPopup() {
		this.popupOpen = true;
	}

	closePopup() {
		this.popupOpen = false;
	}

	addNewTask(tarea: { titulo: string; minutos: number }) {
		// Buscar el último ID en la lista de tareas
		const lastId = this.tareas.length > 0 
			? Math.max(...this.tareas.map(t => t.id)) // Encuentra el ID más alto
			: 0; // Si la lista está vacía, empieza desde 0
	
		const newTask = {
			id: lastId + 1, // Asigna un ID 
			titulo: tarea.titulo,
			minutos: tarea.minutos
		};
		
		this.tareas.push(newTask); 
		this.closePopup(); 
	}

	toggleSelection(tarea: { id: number }) {
		if (this.selectedTasks.has(tarea.id)) {
		  this.selectedTasks.delete(tarea.id);
		} else {
		  this.selectedTasks.add(tarea.id);
		}
	}
	
	isSelected(tarea: { id: number }): boolean {
		return this.selectedTasks.has(tarea.id);
	}

	removeSelectedTasks() {
		this.tareas = this.tareas.filter(tarea => !this.selectedTasks.has(tarea.id));
		this.selectedTasks.clear(); // Limpiar la selección después de eliminar
	}
}
