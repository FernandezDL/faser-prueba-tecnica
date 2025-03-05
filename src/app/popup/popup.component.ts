import { Component, OnInit, EventEmitter, Output  } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Output() cerrar = new EventEmitter<void>(); // Evento cuando se cierra el popup
  @Output() taskAdded = new EventEmitter<{ titulo: string, minutos: number }>(); //Evento al agregar nueva tarea
  
  newTaskTitle: string = "";
  newTaskTime: number | null = null;

  closePopup() {
    this.cerrar.emit(); // Emite el evento al padre (app.component)
  }

  addTask(){
    if(this.newTaskTitle.trim()){
      this.taskAdded.emit({ 
        titulo: this.newTaskTitle, 
        minutos: this.newTaskTime !== null && this.newTaskTime !== undefined ? this.newTaskTime : 0 
      });

      this.newTaskTitle="";
      this.newTaskTime = null;
    }
  }
}
