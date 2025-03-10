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
	sortColumn: string | null = null;	
	sortDirection: boolean = true;

	constructor(
        public service: AppService,
	) { }
	
	ngOnInit() {
		this.obtenerTareas();
	}

	async obtenerTareas() {
		this.tareas = await this.service.obtenerTareas();
		this.tareas = this.tareas.map(t => new Tarea(t.id, t.titulo, t.minutos, t.fav !==undefined ? t.fav: false));
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
	
		const newTask = new Tarea(
			lastId + 1, 
			tarea.titulo, 
			tarea.minutos, 
			false
		);
		
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

	sortBy(column: string) {
		if (this.sortColumn === column) {
		  this.sortDirection = !this.sortDirection; // Invierte el orden si ya está ordenado por esta columna
		} else {
		  this.sortColumn = column;
		  this.sortDirection = true; // Inicia en ascendente
		}
	  
		this.tareas.sort((a, b) => {
		  const valueA = a[column as keyof typeof a];
		  const valueB = b[column as keyof typeof b];
	  
		  if (typeof valueA === "string" && typeof valueB === "string") {
			return this.sortDirection ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
		  } else {
			return this.sortDirection ? Number(valueA) - Number(valueB) : Number(valueB) - Number(valueA);
		  }
		});
	}

	selectFav(tarea: Tarea) {
		tarea.fav = !tarea.fav;
	}	  

	randomizeOrder() {
		this.tareas = this.tareas
		  .map(tarea => ({ tarea, sort: Math.random() })) // Asigna un número aleatorio a cada tarea
		  .sort((a, b) => a.sort - b.sort) // Ordena según el número aleatorio
		  .map(obj => obj.tarea); // Extrae las tareas ordenadas
	}	  
}
